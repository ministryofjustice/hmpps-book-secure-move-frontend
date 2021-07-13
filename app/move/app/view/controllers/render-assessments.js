const presenters = require('../../../../../common/presenters')

function renderAssessments(req, res) {
  const taskList = presenters.moveToTaskListComponent(req.move, {
    baseUrl: req.originalUrl,
  })

  const locals = {
    taskList,
  }

  res
    .breadcrumb({ text: req.t('moves::tabs.assessments') })
    .render('move/app/view/views/assessments', locals)
}

module.exports = renderAssessments
