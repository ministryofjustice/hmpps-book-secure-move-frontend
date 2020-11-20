const presenters = require('../../presenters')

function frameworkOverview(req, res) {
  const { originalUrl, assessment = {}, move } = req
  const moveId = move?.id
  const profile = move?.profile || assessment.profile
  const fullname = profile?.person?.fullname
  const taskList = presenters.frameworkToTaskListComponent({
    baseUrl: `${originalUrl}/`,
    frameworkSections: assessment._framework?.sections,
    sectionProgress: assessment.meta?.section_progress,
  })

  res.render('framework-overview', {
    moveId,
    taskList,
    fullname,
  })
}

module.exports = frameworkOverview
