function saveUrl(req, res, next) {
  req.session.movesUrl = req.originalUrl
  next()
}

module.exports = saveUrl
