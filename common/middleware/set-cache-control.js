module.exports = function setCacheControl(req, res, next) {
  res.set('Cache-control', 'no-store')
  next()
}
