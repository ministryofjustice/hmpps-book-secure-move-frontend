const uuid = require('uuid')

const {
  API: { VERSION },
} = require('../../../../config')

module.exports = {
  name: 'req-headers',
  req: function req(payload = {}) {
    const { req } = payload

    if (!req) {
      return payload
    }

    req.headers = {
      ...req.headers,
      Accept: `application/vnd.api+json; version=${VERSION}`,
      'Idempotency-Key': uuid.v4(),
    }
    return payload
  },
}
