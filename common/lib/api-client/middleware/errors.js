module.exports = {
  name: 'app-errors',
  error: function error(payload = {}) {
    if (!payload.response) {
      if (payload instanceof Error) {
        return payload
      }

      return null
    }

    const { statusCode, statusMessage, body = {} } = payload.response
    const error = new Error(body.error_description || statusMessage)
    error.statusCode = statusCode || 500
    error.errors = body.errors

    return error
  },
}
