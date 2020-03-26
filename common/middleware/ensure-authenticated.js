function _isExpired(authExpiry) {
  if (!authExpiry) {
    return true
  }

  return authExpiry < Math.floor(new Date() / 1000)
}

module.exports = function ensureAuthenticated({
  provider,
  whitelist = [],
  expiryMargin = 5 * 60,
} = {}) {
  return (req, res, next) => {
    let authExpiry = req.session.authExpiry
    if (req.method === 'GET') {
      authExpiry -= expiryMargin
    }
    if (whitelist.includes(req.url) || !_isExpired(authExpiry)) {
      return next()
    }

    req.session.originalRequestUrl = req.originalUrl
    if (req.method === 'POST') {
      let errorKey
      const contentType = req.header('content-type')
      if (contentType.startsWith('multipart/form-data')) {
        errorKey = 'MULTIPART_FAILED_AUTH'
      } else if (req.xhr) {
        errorKey = 'DELETE_FAILED_AUTH'
      }
      if (errorKey) {
        res.status(401)
        const errorString = req.t(`validation::${errorKey}`)
        return res.send(errorString)
      }
      req.session.originalRequestBody = req.body
    }
    res.redirect(`/connect/${provider}`)
  }
}
