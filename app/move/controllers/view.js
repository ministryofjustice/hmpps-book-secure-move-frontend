const getViewLocals = require('./view/view.locals')

module.exports = function view(req, res) {
  const locals = getViewLocals(req)

  res.render('move/views/view', locals)
}
