const getRequestHeaders = require('../request-headers')

module.exports = {
  name: 'req-headers',
  req: function req(payload = {}) {
    const { req } = payload

    if (!req) {
      return payload
    }

    req.headers = {
      ...req.headers,
      ...getRequestHeaders(),
    }
    return payload
  },
}
