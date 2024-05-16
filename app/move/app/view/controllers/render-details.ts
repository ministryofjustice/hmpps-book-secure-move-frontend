import { isNil, mapValues } from 'lodash'

// @ts-ignore
// eslint-disable-next-line import/no-duplicates
import { canEditMoveDate } from '../../../../../common/helpers/move'
// @ts-ignore
// eslint-disable-next-line import/no-duplicates
import { canEditMoveDestination } from '../../../../../common/helpers/move'
// @ts-ignore
// eslint-disable-next-line import/no-duplicates
import { getUpdateUrls } from '../../../../../common/helpers/move'
// @ts-ignore
// eslint-disable-next-line import/no-duplicates
import { mapUpdateLink } from '../../../../../common/helpers/move'
import { canEditLodging } from '../../../../../common/helpers/move/lodging/can-edit-lodging'
// @ts-ignore
import presenters from '../../../../../common/presenters'
import { AssessmentCategory } from '../../../../../common/types/assessment-category'
import { BasmRequest } from '../../../../../common/types/basm_request'
import { BasmResponse } from '../../../../../common/types/basm_response'
import { Move } from '../../../../../common/types/move'

function _filterCourtMoves(move: Move) {
  return (category: AssessmentCategory) => {
    return !(move.move_type !== 'court_appearance' && category?.key === 'court')
  }
}

export function renderDetails(req: BasmRequest, res: BasmResponse) {
  const { canAccess, move, journeys } = req
  const per = move?.profile?.person_escort_record
  const perStarted = !isNil(per) && per.status !== 'not_started'
  const hasProfile = !isNil(move?.profile)
  const { assessment_answers: assessmentAnswers = [] } = move.profile || {}
  const uneditableCategories = ['risk', 'health']

  const updateUrls = getUpdateUrls(move, canAccess)

  if (!canEditMoveDate(move, canAccess)) {
    delete updateUrls.date
  }

  if (!canEditMoveDestination(move, canAccess)) {
    delete updateUrls.move
  }

  const updateLinks = mapValues(updateUrls, mapUpdateLink)

  const extraditionSummary = move.extradition_flight ? presenters.extraditionFlightToSummaryListComponent(move.extradition_flight) : false

  const moveSummary = presenters.moveToSummaryListComponent(move, journeys, {
    updateUrls,
    canAccess,
  })

  const additionalInfo = presenters.moveToAdditionalInfoListComponent(
    move,
    updateUrls
  )
  const singleRequestInfo = presenters.singleRequestToSummaryListComponent(move)

  const assessmentsByCategory =
    presenters.assessmentAnswersByCategory(assessmentAnswers)
  const editableAssessments = assessmentsByCategory
    .filter(_filterCourtMoves(move))
    .filter(
      (category: AssessmentCategory) =>
        !uneditableCategories.includes(category?.key)
    )
    .map(presenters.assessmentCategoryToSummaryListComponent)
  const uneditableAssessments = assessmentsByCategory
    .filter((category: AssessmentCategory) =>
      uneditableCategories.includes(category?.key)
    )
    .map(presenters.assessmentCategoryToSummaryListComponent)

  let uneditableSections
  let editableSections

  if (perStarted) {
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
    moveId: move.id,
    allocation: move.allocation,
    extradition: extraditionSummary,
    isPerLocked: move._isPerLocked,
    canEditPer: move._canEditPer,
    isAllocationMove: !isNil(move.allocation),
    lodgings: move.lodgings
      ?.sort((a, b) => a.start_date.localeCompare(b.start_date))
      .map(l => {
        return {
          ...l,
          canEdit: canEditLodging(l, canAccess),
        }
      }),
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
