export function serializeContext(ctx) {
  try {
    const newContext = {}
    const allowedFields = [ 'user', 'headers', 'requestId', 'ip' ]
    for (const prop in ctx) {
      if (ctx.hasOwnProperty(prop) && allowedFields.includes(prop)) {
        newContext[prop] = ctx[prop]
      }
    }
    if (newContext['headers']) {
      const newHeaders  = {}
      const allowedHeaderFields  = [ 'x-requestid' ]
      for (const prop in newContext['headers']) {
        if (newContext['headers'].hasOwnProperty(prop) && allowedHeaderFields.includes(prop)) {
          newHeaders[prop] = newContext['headers'][prop]
        }
      }
      newContext['headers'] = newHeaders
    }
    return newContext
  } catch (err) { // dont cause side effects on error
    return ctx
  }
}
