module.exports = function list(req, res) {
  const template = 'moves/views/dashboard'
  res.render(template, res.locals)
}
