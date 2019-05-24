function ensureAuthenticated (req, res, next) {
  if (!authExpired(req)) return next()
  req.session.postAuthRedirect = req.originalUrl
  res.redirect('/connect/okta')
}

function authExpired (req) {
  if (!authExpiry(req)) return true
  return authExpiry(req) < Math.floor(new Date() / 1000)
}

function authExpiry (req) {
  return req.session.authExpiry
}

module.exports = {
  ensureAuthenticated,
  authExpired,
  authExpiry,
}
