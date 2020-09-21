module.exports = function setUser(req, res, next) {
  const { user } = req.session

  if (user) {
    req.user = user
  }

  next()
}
