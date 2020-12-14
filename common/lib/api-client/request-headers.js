const uuid = require('uuid')

const {
  API: { VERSION },
  APP_VERSION,
  CUSTOM_HEADERS,
} = require('../../../config')

module.exports = (req, format = 'application/vnd.api+json') => {
  const headers = {
    'User-Agent': `hmpps-book-secure-move-frontend/${APP_VERSION}`,
    Accept: `${format}; version=${VERSION}`,
    'Accept-Encoding': 'gzip',
    'Idempotency-Key': uuid.v4(),
    ...CUSTOM_HEADERS,
  }

  if (req && req.user) {
    headers['X-Current-User'] = req.user.username
  }

  return headers
}
