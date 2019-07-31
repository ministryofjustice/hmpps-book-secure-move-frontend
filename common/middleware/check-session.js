module.exports = function checkSession(req, res, next) {
  if (req.session) {
    return next()
  }

  next(new Error('No session available. Check Redis connection.'))
}
