const { snakeCase } = require('lodash')

const moveHelpers = require('../../helpers/move')
const presenters = require('../../presenters')

function frameworkOverview(req, res) {
  const { originalUrl, assessment = {}, move } = req
  const moveId = move?.id
  const profile = move?.profile || assessment.profile
  const fullname = profile?.person?._fullname
  const taskList = presenters.frameworkToTaskListComponent({
    baseUrl: `${originalUrl}/`,
    frameworkSections: assessment._framework?.sections,
    sectionProgress: assessment.meta?.section_progress,
  })
  const i18nContext = snakeCase(assessment.framework?.name || '')

  res.render('framework-overview', {
    ...moveHelpers.getMoveSummary(move),
    i18nContext,
    moveId,
    taskList,
    fullname,
  })
}

module.exports = frameworkOverview
