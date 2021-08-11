function renderAssessments(req, res) {
  const locals = {}

  res.render('move/app/view/views/assessments', locals)
}

module.exports = renderAssessments
