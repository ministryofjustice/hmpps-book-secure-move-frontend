module.exports = {
  name: 'app-errors',
  error: function error(payload = {}) {
    if (!payload.response) {
      if (payload instanceof Error) {
        return payload
      }

      return null
    }

    const { status, statusText, data = {} } = payload.response
    const error = new Error(data.error_description || statusText)
    error.statusCode = status || 500
    error.errors = data.errors

    return error
  },
}
