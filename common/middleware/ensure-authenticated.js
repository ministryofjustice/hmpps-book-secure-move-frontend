function _isExpired(authExpiry) {
  if (!authExpiry) {
    return true
  }

  return authExpiry < Math.floor(new Date() / 1000)
}

module.exports = function ensureAuthenticated({
  provider,
  whitelist = [],
  expiryMargin,
} = {}) {
  return (req, res, next) => {
    let authExpiry = req.session.authExpiry
    if (req.method === 'GET' && expiryMargin) {
      authExpiry -= expiryMargin
    }
    if (whitelist.includes(req.url) || !_isExpired(authExpiry)) {
      return next()
    }

    req.session.originalRequestUrl = req.originalUrl

    if (req.method === 'POST') {
      const contentType = req.get('content-type') || ''
      const isMultipart = contentType.startsWith('multipart/form-data;')
      if (isMultipart || req.xhr) {
        const error = new Error(
          req.t('validation::AUTH_EXPIRED', {
            context: isMultipart ? 'MULTIPART' : '',
          })
        )
        error.statusCode = 422
        return next(error)
      }

      req.session.originalRequestBody = req.body
    }
    res.redirect(`/connect/${provider}`)
  }
}
