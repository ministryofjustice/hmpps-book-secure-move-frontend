function renderAssessments(req, res) {
  const locals = {}

  res
    .breadcrumb({ text: req.t('moves::tabs.assessments') })
    .render('move/app/view/views/assessments', locals)
}

module.exports = renderAssessments
