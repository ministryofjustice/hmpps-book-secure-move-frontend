const getRequestHeaders = require('../request-headers')

module.exports = {
  name: 'request-headers',
  req: function req(payload = {}) {
    if (payload.res) {
      return payload
    }

    const { req } = payload

    req.headers = {
      ...req.headers,
      ...getRequestHeaders(),
    }
    return payload
  },
}
