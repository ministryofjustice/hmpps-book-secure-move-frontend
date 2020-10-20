const uuid = require('uuid')

const {
  API: { VERSION },
  APP_VERSION,
} = require('../../../config')

module.exports = ({ req = {}, format = 'application/vnd.api+json' } = {}) => {
  const idempotencyKey = uuid.v4()
  const transactionId = req.transactionId || `auto-${idempotencyKey}`
  const headers = {
    'User-Agent': `hmpps-book-secure-move-frontend/${APP_VERSION}`,
    Accept: `${format}; version=${VERSION}`,
    'Accept-Encoding': 'gzip',
    'Idempotency-Key': idempotencyKey,
    'X-Transaction-Id': transactionId,
  }

  return headers
}
