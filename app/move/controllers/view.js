const { get, sortBy } = require('lodash')

const presenters = require('../../../common/presenters')
const { FEATURE_FLAGS } = require('../../../config')
const updateSteps = require('../steps/update')

const getUpdateLinks = require('./view/view.update.links')
const getUpdateUrls = require('./view/view.update.urls')

module.exports = function view(req, res) {
  const { move } = req
  const {
    profile,
    status,
    cancellation_reason: cancellationReason,
    cancellation_reason_comment: cancellationComments,
    rejection_reason: rejectionReason,
  } = move
  const bannerStatuses = ['cancelled']
  const userPermissions = get(req.session, 'user.permissions')
  const updateUrls = getUpdateUrls(updateSteps, move.id, userPermissions)
  const updateActions = getUpdateLinks(updateSteps, updateUrls)
  const {
    person,
    assessment_answers: assessmentAnswers = [],
    person_escort_record: personEscortRecord,
  } = profile || {}
  const personEscortRecordIsComplete = personEscortRecord?.status === 'complete'
  const personEscortRecordUrl = personEscortRecord?.id
    ? `/person-escort-record/${personEscortRecord.id}`
    : `/person-escort-record/new/${move.id}`
  const showPersonEscortRecordBanner =
    FEATURE_FLAGS.PERSON_ESCORT_RECORD &&
    !personEscortRecordIsComplete &&
    move.status === 'requested' &&
    move.profile?.id !== undefined
  const urls = {
    update: updateUrls,
  }

  const locals = {
    move,
    personEscortRecord,
    personEscortRecordIsComplete,
    personEscortRecordUrl,
    showPersonEscortRecordBanner,
    moveSummary: presenters.moveToMetaListComponent(move, updateActions),
    personalDetailsSummary: presenters.personToSummaryListComponent(person),
    tagList: presenters.assessmentToTagList(assessmentAnswers),
    assessment: presenters
      .assessmentAnswersByCategory(assessmentAnswers)
      .map(presenters.assessmentCategoryToPanelComponent),
    canCancelMove:
      (userPermissions.includes('move:cancel') &&
        move.status === 'requested' &&
        !move.allocation) ||
      (userPermissions.includes('move:cancel:proposed') &&
        move.status === 'proposed'),
    courtHearings: sortBy(move.court_hearings, 'start_time').map(
      courtHearing => {
        return {
          ...courtHearing,
          summaryList: presenters.courtHearingToSummaryListComponent(
            courtHearing
          ),
        }
      }
    ),
    courtSummary: presenters.assessmentToSummaryListComponent(
      assessmentAnswers,
      'court'
    ),
    messageTitle: bannerStatuses.includes(status)
      ? req.t('statuses::' + status, { context: cancellationReason })
      : undefined,
    messageContent: req.t('statuses::description', {
      context: rejectionReason || cancellationReason,
      comment: cancellationComments,
    }),
    updateLinks: updateActions,
    urls,
  }

  res.render('move/views/view', locals)
}
