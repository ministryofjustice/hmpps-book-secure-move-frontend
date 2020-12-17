const getRequestHeaders = require('../request-headers')

module.exports = function requestHeaders(requestObject) {
  return {
    name: 'request-headers',
    req: function req(payload = {}) {
      if (payload.res) {
        return payload
      }

      const { req } = payload

      req.headers = {
        ...req.headers,
        ...getRequestHeaders(requestObject),
      }
      return payload
    },
  }
}
