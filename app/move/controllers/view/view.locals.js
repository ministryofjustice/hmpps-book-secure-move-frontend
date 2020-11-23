const { isEmpty, find, sortBy } = require('lodash')

const presenters = require('../../../../common/presenters')
const updateSteps = require('../../steps/update')

const getTabsUrls = require('./view.tabs.urls')
const getUpdateLinks = require('./view.update.links')
const getUpdateUrls = require('./view.update.urls')

function getViewLocals(req) {
  const { move } = req
  const {
    profile,
    status,
    cancellation_reason: cancellationReason,
    cancellation_reason_comment: cancellationComments,
    rejection_reason: rejectionReason,
    rebook,
  } = move
  const tabsUrls = getTabsUrls(move)
  const moveUrl = tabsUrls.view
  const bannerStatuses = ['cancelled']
  const updateUrls = getUpdateUrls(updateSteps, move, req)
  const updateActions = getUpdateLinks(updateSteps, updateUrls)
  const messageBanner = presenters.moveToMessageBannerComponent({
    move,
    moveUrl: moveUrl,
    canAccess: req.canAccess,
  })
  const {
    person,
    assessment_answers: assessmentAnswers = [],
    person_escort_record: personEscortRecord,
  } = profile || {}
  const personEscortRecordIsEnabled = req.canAccess('person_escort_record:view')
  const personEscortRecordIsCompleted =
    !isEmpty(personEscortRecord) &&
    !['not_started', 'in_progress'].includes(personEscortRecord?.status)
  const personEscortRecordUrl = `${moveUrl}/person-escort-record`
  const personEscortRecordTagList = presenters.frameworkFlagsToTagList(
    personEscortRecord?.flags,
    moveUrl
  )
  const urls = {
    update: updateUrls,
    tabs: tabsUrls,
  }
  const assessment = presenters
    .assessmentAnswersByCategory(assessmentAnswers)
    .filter(category => category.key !== 'court')
    .map(presenters.assessmentCategoryToPanelComponent)
  const courtSummary = presenters
    .assessmentAnswersByCategory(assessmentAnswers)
    .filter(category => category.key === 'court')
    .map(presenters.assessmentCategoryToSummaryListComponent)[0]
  const assessmentSections = sortBy(
    personEscortRecord?._framework?.sections,
    'order'
  )
    .map(
      presenters.frameworkSectionToPanelList({
        tagList: personEscortRecordTagList,
        questions: personEscortRecord?._framework?.questions,
        personEscortRecord,
        personEscortRecordUrl,
      })
    )
    .map(section => {
      return {
        ...section,
        previousAssessment: find(assessment, {
          frameworksSection: section.key,
        }),
      }
    })

  const userPermissions = req.session?.user?.permissions
  const locals = {
    move,
    messageBanner,
    assessment,
    courtSummary,
    personEscortRecordIsEnabled,
    personEscortRecordIsCompleted,
    personEscortRecordTagList,
    assessmentSections,
    moveSummary: presenters.moveToMetaListComponent(move, updateActions),
    personalDetailsSummary: presenters.personToSummaryListComponent(person),
    additionalInfoSummary: presenters.moveToAdditionalInfoListComponent(move),
    tagList: presenters.assessmentToTagList(assessmentAnswers, moveUrl),
    canCancelMove:
      (userPermissions.includes('move:cancel') &&
        !move.allocation &&
        (move.status === 'requested' || move.status === 'booked')) ||
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
    messageTitle: bannerStatuses.includes(status)
      ? req.t('statuses::' + status, { context: cancellationReason })
      : undefined,
    messageContent: req.t('statuses::description', {
      context: rejectionReason || cancellationReason,
      comment: cancellationComments,
      cancellation_reason_comment: cancellationComments,
      rebook,
    }),
    updateLinks: updateActions,
    urls,
  }

  return locals
}

module.exports = getViewLocals
