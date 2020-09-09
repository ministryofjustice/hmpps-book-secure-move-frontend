const uuid = require('uuid')

const {
  API: { VERSION },
  APP_VERSION,
} = require('../../../config')

module.exports = (format = 'application/vnd.api+json') => {
  return {
    'User-Agent': `hmpps-book-secure-move-frontend/${APP_VERSION}`,
    Accept: `${format}; version=${VERSION}`,
    'Accept-Encoding': 'gzip',
    'Idempotency-Key': uuid.v4(),
  }
}
