const presenters = require('../../../common/presenters')

function frameworkOverview(req, res) {
  const { originalUrl, framework, personEscortRecord = {} } = req
  const { meta, profile } = personEscortRecord
  const fullname = profile?.person?.fullname
  const taskList = presenters.frameworkToTaskListComponent({
    baseUrl: `${originalUrl}/`,
    frameworkSections: framework.sections,
    sectionProgress: meta?.section_progress,
  })

  res.render('person-escort-record/views/framework-overview', {
    taskList,
    fullname,
  })
}

module.exports = frameworkOverview
