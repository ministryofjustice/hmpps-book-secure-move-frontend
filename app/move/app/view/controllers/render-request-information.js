const { mapValues } = require('lodash')

const moveHelpers = require('../../../../../common/helpers/move')
const presenters = require('../../../../../common/presenters')

function renderRequestInformation(req, res) {
  const { canAccess, move } = req
  const { assessment_answers: assessmentAnswers = [] } = move.profile || {}

  const updateUrls = moveHelpers.getUpdateUrls(move, canAccess)
  const updateLinks = mapValues(updateUrls, moveHelpers.mapUpdateLink)

  const moveSummary = presenters.moveToSummaryListComponent(move, {
    includeChangeLinks: move._canEdit,
    updateUrls,
  })

  const assessments = presenters
    .assessmentAnswersByCategory(assessmentAnswers)
    .map(presenters.assessmentCategoryToSummaryListComponent)

  const locals = {
    assessments,
    isEditable: move._canEdit,
    moveSummary,
    updateLinks,
  }

  res
    .breadcrumb({
      text: req.t('moves::tabs.assessments'),
      href: `${req.baseUrl}/assessments`,
    })
    .breadcrumb({ text: 'Booking information' })
    .render('move/app/view/views/request-information', locals)
}

module.exports = renderRequestInformation
