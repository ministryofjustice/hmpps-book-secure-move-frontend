const presenters = require('../../../common/presenters')

function frameworkOverview(req, res) {
  const { originalUrl, framework, personEscortRecord = {}, move } = req
  const moveId = move?.id
  const profile = move?.profile || personEscortRecord?.profile
  const fullname = profile?.person?.fullname
  const taskList = presenters.frameworkToTaskListComponent({
    baseUrl: `${originalUrl}/`,
    frameworkSections: framework.sections,
    sectionProgress: personEscortRecord?.meta?.section_progress,
  })

  res.render('person-escort-record/views/framework-overview', {
    moveId,
    taskList,
    fullname,
  })
}

module.exports = frameworkOverview
