const presenters = require('../../../../../common/presenters')

function renderAssessments(req, res) {
  const taskList = presenters.moveToTaskListComponent(req.move, {
    baseUrl: req.originalUrl,
  })

  const locals = {
    taskList,
  }

  res.render('move/app/view/views/assessments', locals)
}

module.exports = renderAssessments
