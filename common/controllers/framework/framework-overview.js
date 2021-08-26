const { snakeCase } = require('lodash')

const moveHelpers = require('../../helpers/move')
const presenters = require('../../presenters')

function frameworkOverview(req, res) {
  const { originalUrl, assessment = {}, move } = req
  const moveId = move?.id
  const baseUrl = req.baseUrl
  const profile = move?.profile || assessment.profile
  const fullname = profile?.person?._fullname
  const taskList = presenters.frameworkToTaskListComponent({
    baseUrl: `${originalUrl}/`,
    frameworkSections: assessment._framework?.sections,
    sectionProgress: assessment.meta?.section_progress,
  })
  const i18nContext = snakeCase(assessment.framework?.name || '')
  const isCompleted = req.assessment.completed_at !== null

  res.render('framework-overview', {
    ...moveHelpers.getMoveSummary(move),
    isCompleted,
    baseUrl,
    i18nContext,
    moveId,
    taskList,
    fullname,
  })
}

module.exports = frameworkOverview
