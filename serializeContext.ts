export function serializeContext(context) {
  try {
    const newContext = {}
    const allowedFields = [ 'user', 'headers', 'requestId' ]
    for (const prop in context) {
      if (context.hasOwnProperty(prop) && allowedFields.includes(prop)) {
        newContext[prop] = context[prop]
      }
    }
    return newContext
  } catch (err) { // dont cause side effects on error
    return context
  }
}
