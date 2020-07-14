const presenters = require('../../../common/presenters')

function frameworkOverview(req, res) {
  const { originalUrl, framework, personEscortRecord } = req
  const fullname = personEscortRecord?.profile?.person?.fullname
  const taskList = presenters.frameworkToTaskListComponent(`${originalUrl}/`)(
    framework
  )

  res.render('person-escort-record/views/framework-overview', {
    taskList,
    fullname,
  })
}

module.exports = frameworkOverview
