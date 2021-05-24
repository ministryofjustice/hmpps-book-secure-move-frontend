const { get } = require('lodash')

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
    let message = body.error_description || statusMessage

    if (statusCode === 422 && get(body, 'errors[0].title')) {
      message += `: ${body.errors[0].title}`
    }

    const error = new Error(message)
    error.statusCode = statusCode || 500
    error.errors = body.errors
    error.requesturl = requestUrl

    return error
  },
}
