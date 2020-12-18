const uuid = require('uuid')

const {
  API: { VERSION },
  APP_VERSION,
} = require('../../../config')

module.exports = (req, format = 'application/vnd.api+json') => {
  const headers = {
    'User-Agent': `hmpps-book-secure-move-frontend/${APP_VERSION}`,
    Accept: `${format}; version=${VERSION}`,
    'Accept-Encoding': 'gzip',
    'Idempotency-Key': uuid.v4(),
  }

  if (req && req.user && req.user.username) {
    headers['X-Current-User'] = req.user.username
  }

  return headers
}
