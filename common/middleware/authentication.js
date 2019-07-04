function _isExpired (authExpiry) {
  if (!authExpiry) {
    return true
  }

  return authExpiry < Math.floor(new Date() / 1000)
}

module.exports = function ensureAuthenticated (provider) {
  return (req, res, next) => {
    if (!_isExpired(req.session.authExpiry)) {
      return next()
    }

    req.session.postAuthRedirect = req.originalUrl
    res.redirect(`/connect/${provider}`)
  }
}
