module.exports = {
  name: 'got-errors',
  error: function error(payload = {}) {
    if (!payload.response) {
      if (payload instanceof Error) {
        return payload
      }

      return null
    }

    const {
      body = {},
      requestUrl,
      statusCode,
      statusMessage,
    } = payload.response
    const error = new Error(body.error_description || statusMessage)
    error.statusCode = statusCode || 500
    error.errors = body.errors
    error.requesturl = requestUrl

    return error
  },
}
