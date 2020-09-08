const uuid = require('uuid')

const {
  API: { VERSION },
} = require('../../../config')

module.exports = (format = 'application/vnd.api+json') => {
  return {
    Accept: `${format}; version=${VERSION}`,
    'Accept-Encoding': 'gzip',
    'Idempotency-Key': uuid.v4(),
  }
}
