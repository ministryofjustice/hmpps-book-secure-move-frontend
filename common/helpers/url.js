const { IS_PRODUCTION, SERVER_HOST } = require('../../config')

function buildUrl (path = '', domain = SERVER_HOST, secure = IS_PRODUCTION) {
  const protocol = secure ? 'https' : 'http'
  return new URL(path, `${protocol}://${domain}`).href
}

module.exports = {
  buildUrl,
}
