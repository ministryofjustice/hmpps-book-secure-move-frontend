function _isExpired (authExpiry) {
  if (!authExpiry) {
    return true
  }

  return authExpiry < Math.floor(new Date() / 1000)
}

function ensureAuthenticated (req, res, next) {
  if (!_isExpired(req.session.authExpiry)) {
    return next()
  }

  req.session.postAuthRedirect = req.originalUrl
  res.redirect('/connect/hmpps')
}

module.exports = {
  ensureAuthenticated,
}
