const getUpdateLinks = require('../../../../../common/helpers/move/get-update-links')
const presenters = require('../../../../../common/presenters')
const updateSteps = require('../../edit/steps')

function renderRequestInformation(req, res) {
  const { move } = req
  const { assessment_answers: assessmentAnswers = [] } = move.profile || {}

  const moveSummary = presenters.moveToSummaryListComponent(move, {
    includeChangeLinks: move._canEdit,
    updateSteps,
  })

  const assessments = presenters
    .assessmentAnswersByCategory(assessmentAnswers)
    .map(presenters.assessmentCategoryToSummaryListComponent)

  const locals = {
    assessments,
    isEditable: move._canEdit,
    moveSummary,
    updateLinks: getUpdateLinks(move, undefined, updateSteps),
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
