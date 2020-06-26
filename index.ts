import * as Sentry from '@sentry/node'
import * as stream from 'stream'

import { createLogger, stdSerializers } from 'bunyan'

import { serializeContext } from './serializeContext'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: process.env.COMMIT_SHA
})

const getLogLevelBasedOnNodeEnv = () => {
  if (process.env.NODE_ENV === 'production') return 'info'
  if (process.env.NODE_ENV === 'staging') return 'debug'
  return 'trace'
}

class SentryStream extends stream.Writable {
  _write(chunk, enc, next) {
    const message = JSON.parse(chunk.toString())
    Sentry.captureMessage(`${process.env.NODE_ENV} ${message.name} - ${message.msg}`, Sentry.Severity.Fatal)
    next()
  }
}

export const getLogger = (serviceName?: string, getRrid?) => {
  const logger = createLogger({
    name: serviceName || 'unknown-service',
    level: getLogLevelBasedOnNodeEnv(),
    src: process.env.NODE_ENV !== 'production',
    streams: [
      {
        name: 'std',
        stream: new stream.Writable({
          write: function(chunk, encoding, next) {
            const message = JSON.parse(chunk.toString())
            try {
              message.reqId = getRrid ? getRrid() : message.reqId
            } catch (err) { }

            console.log(JSON.stringify(message))

            next()
          }
        })
      },
      {
        name: 'sentry',
        stream: new SentryStream(),
        level: 'fatal'
      }
    ],
    serializers: {
      err: stdSerializers.err,
      context: serializeContext,
      ctx: serializeContext
    }
  })

  return logger
}
