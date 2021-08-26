const { isNil, mapValues } = require('lodash')

const moveHelpers = require('../../../../../common/helpers/move')
const presenters = require('../../../../../common/presenters')

function _filterCourtMoves(move) {
  return category => {
    if (move.move_type !== 'court_appearance' && category?.key === 'court') {
      return false
    }

    return true
  }
}

function renderDetails(req, res) {
  const { canAccess, move } = req
  const hasPersonEscortRecord = !isNil(move?.profile?.person_escort_record)
  const hasProfile = !isNil(move?.profile)
  const { assessment_answers: assessmentAnswers = [] } = move.profile || {}
  const uneditableCategories = ['risk', 'health']

  const updateUrls = moveHelpers.getUpdateUrls(move, canAccess)
  const updateLinks = mapValues(updateUrls, moveHelpers.mapUpdateLink)

  const moveSummary = presenters.moveToSummaryListComponent(move, {
    updateUrls,
  })

  const additionalInfo = presenters.moveToAdditionalInfoListComponent(move)
  const singleRequestInfo = presenters.singleRequestToSummaryListComponent(move)

  const assessmentsByCategory =
    presenters.assessmentAnswersByCategory(assessmentAnswers)
  const editableAssessments = assessmentsByCategory
    .filter(_filterCourtMoves(move))
    .filter(category => !uneditableCategories.includes(category?.key))
    .map(presenters.assessmentCategoryToSummaryListComponent)
  const uneditableAssessments = assessmentsByCategory
    .filter(category => uneditableCategories.includes(category?.key))
    .map(presenters.assessmentCategoryToSummaryListComponent)

  let uneditableSections
  let editableSections

  if (hasPersonEscortRecord) {
    uneditableSections = uneditableAssessments
    editableSections = [
      singleRequestInfo,
      additionalInfo,
      ...editableAssessments,
    ]
  } else if (hasProfile) {
    editableSections = [
      singleRequestInfo,
      additionalInfo,
      ...editableAssessments,
      ...uneditableAssessments,
    ]
  }

  const locals = {
    allocation: move.allocation,
    isEditable: move._canEdit,
    isAllocationMove: !isNil(move.allocation),
    hasYouthRiskAssessment: !isNil(move.profile?.youth_risk_assessment),
    hasPersonEscortRecord: !isNil(move.profile?.person_escort_record),
    moveId: move.id,
    moveSummary,
    sections: {
      uneditable: uneditableSections
        ? uneditableSections.filter(Boolean)
        : undefined,
      editable: editableSections ? editableSections.filter(Boolean) : undefined,
    },
    updateLinks,
  }

  res.render('move/app/view/views/details', locals)
}

module.exports = renderDetails
