const FormData = require('form-data')
const { find } = require('lodash')

module.exports = function post(maxFileSize) {
  return {
    name: 'POST',
    req: payload => {
      const { req, jsonApi } = payload
      const originalMiddleware = find(jsonApi._originalMiddleware, {
        name: 'POST',
      })

      if (req.method === 'POST' && req.data instanceof FormData) {
        payload.req.maxContentLength = maxFileSize
        payload.req.maxBodyLength = maxFileSize
        payload.req.headers = {
          ...req.headers,
          ...req.data.getHeaders(),
        }

        return payload
      }

      return originalMiddleware.req(payload)
    },
  }
}
