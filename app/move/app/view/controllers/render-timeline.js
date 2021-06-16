function renderTimeline(req, res) {
  const locals = {}

  res.render('move/app/view/views/timeline', locals)
}

module.exports = renderTimeline
