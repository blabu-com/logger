import * as Sentry from '@sentry/node'
import * as stream from 'stream'

import { createLogger, stdSerializers } from 'bunyan'

import { serializeContext } from './serializeContext'

Sentry.init({ dsn: process.env.SENTRY_DSN })

const getLogLevelBasedOnNodeEnv = () => {
  if (process.env.NODE_ENV === 'production') return 'info'
  if (process.env.NODE_ENV === 'staging') return 'debug'
  if (process.env.NODE_ENV === 'development') return 'trace'
  if (process.env.NODE_ENV === 'test') return 'trace'
}

class SentryStream extends stream.Writable {
  _write(chunk, enc, next) {
    const message = JSON.parse(chunk.toString())
    Sentry.captureMessage(`${process.env.NODE_ENV} ${message.name} - ${message.msg}`, Sentry.Severity.Fatal)
    next()
  }
}

export const getLogger = (serviceName: string, getRrid?) => {
  const logger = createLogger({
    name: serviceName,
    level: getLogLevelBasedOnNodeEnv(),
    src: process.env.NODE_ENV !== 'production',
    streams: [
      {
        name: 'std',
        stream: new stream.Writable({
          write: function(chunk, encoding, next) {
            let t
            try {
              t = JSON.parse(chunk.toString())
              t.reqId = getRrid ? getRrid() : undefined
            } catch (err) {
              t.reqId = undefined
            }

            console.log(JSON.stringify(t))

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
      context: serializeContext
    }
  })

  return logger
}
