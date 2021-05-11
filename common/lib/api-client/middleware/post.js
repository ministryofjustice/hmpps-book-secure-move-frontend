const FormData = require('form-data')
const { find } = require('lodash')

module.exports = function post(maxFileSize) {
  return {
    name: 'app-post',
    req: payload => {
      const { req, jsonApi } = payload

      if (req.method === 'POST' && req.data instanceof FormData) {
        req.maxContentLength = maxFileSize
        req.maxBodyLength = maxFileSize
        req.headers = {
          ...req.headers,
          ...req.data.getHeaders(),
        }

        return payload
      }

      const originalMiddleware = find(jsonApi._originalMiddleware, {
        name: 'POST',
      })

      return originalMiddleware.req(payload)
    },
  }
}
