const { snakeCase } = require('lodash')

const moveHelpers = require('../../helpers/move')
const presenters = require('../../presenters')

function frameworkOverview(req, res) {
  const { originalUrl, assessment = {}, move, canAccess, baseUrl } = req
  const moveId = move?.id
  const profile = move?.profile || assessment.profile
  const fullname = profile?.person?._fullname
  const taskList = presenters.frameworkToTaskListComponent({
    baseUrl: `${originalUrl}/`,
    frameworkSections: assessment._framework?.sections,
    sectionProgress: assessment.meta?.section_progress,
  })
  const i18nContext = snakeCase(assessment.framework?.name || '')

  const canPrint =
    canAccess(`${i18nContext}:print`) &&
    (['confirmed', 'completed'].includes(assessment.status) ||
      !!assessment.handover_occurred_at)

  res.render('framework-overview', {
    ...moveHelpers.getMoveSummary(move),
    i18nContext,
    moveId,
    taskList,
    fullname,
    canPrint,
    baseUrl,
  })
}

module.exports = frameworkOverview
