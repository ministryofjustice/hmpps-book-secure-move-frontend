function renderDetails(req, res) {
  const locals = {}

  res.render('move/app/view/views/details', locals)
}

module.exports = renderDetails
