function renderWarnings(req, res) {
  const locals = {}

  res.render('move/app/view/views/warnings', locals)
}

module.exports = renderWarnings
