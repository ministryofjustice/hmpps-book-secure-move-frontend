const FormData = require('form-data')
const { find } = require('lodash')
const { FILE_UPLOADS } = require('../../../../config')

module.exports = {
  name: 'POST',
  req: payload => {
    const { req, jsonApi } = payload
    const originalMiddleware = find(jsonApi._originalMiddleware, {
      name: 'POST',
    })

    if (req.method === 'POST' && req.data instanceof FormData) {
      payload.req.maxContentLength = FILE_UPLOADS.MAX_FILE_SIZE
      payload.req.maxBodyLength = FILE_UPLOADS.MAX_FILE_SIZE
      payload.req.headers = {
        ...req.headers,
        ...req.data.getHeaders(),
      }

      return payload
    }

    return originalMiddleware.req(payload)
  },
}
