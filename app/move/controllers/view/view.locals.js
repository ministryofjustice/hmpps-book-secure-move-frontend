const { isEmpty, find, map, sortBy } = require('lodash')

const presenters = require('../../../../common/presenters')
const { FEATURE_FLAGS } = require('../../../../config')
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
    moveUrl,
    canAccess: req.canAccess,
  })
  const {
    person,
    assessment_answers: assessmentAnswers = [],
    person_escort_record: personEscortRecord,
    youth_risk_assessment: youthRiskAssessment,
  } = profile || {}
  const personEscortRecordIsEnabled = req.canAccess('person_escort_record:view')
  const personEscortRecordIsCompleted =
    !isEmpty(personEscortRecord) &&
    !['not_started', 'in_progress'].includes(personEscortRecord?.status)
  const personEscortRecordTagList = presenters.frameworkFlagsToTagList({
    flags: personEscortRecord?.flags,
    hrefPrefix: moveUrl,
    includeLink: true,
  })
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
  const youthAssessmentSections = map(
    youthRiskAssessment?._framework?.sections,
    presenters.frameworkSectionToPanelList({
      baseUrl: `${moveUrl}/youth-risk-assessment`,
    })
  )
  const perAssessmentSections = map(
    personEscortRecord?._framework?.sections,
    presenters.frameworkSectionToPanelList({
      baseUrl: `${moveUrl}/person-escort-record`,
    })
  ).map(section => {
    return {
      ...section,
      previousAssessment:
        move._is_youth_move &&
        youthRiskAssessment &&
        FEATURE_FLAGS.YOUTH_RISK_ASSESSMENT
          ? find(youthAssessmentSections, { key: section.key })
          : find(assessment, { frameworksSection: section.key }),
    }
  })
  const combinedSections = perAssessmentSections.reduce((acc, section) => {
    const key = section.previousAssessment?.key

    if (key) {
      acc.push(key)
    }

    return acc
  }, [])
  const combinedAssessmentSections = [
    ...perAssessmentSections,
    ...youthAssessmentSections.filter(
      section =>
        FEATURE_FLAGS.YOUTH_RISK_ASSESSMENT &&
        !combinedSections.includes(section.key)
    ),
  ]

  const userPermissions = req.session?.user?.permissions
  const locals = {
    move,
    messageBanner,
    assessment,
    courtSummary,
    personEscortRecord,
    personEscortRecordIsEnabled,
    personEscortRecordIsCompleted,
    personEscortRecordTagList,
    youthRiskAssessment,
    youthRiskAssessmentIsEnabled: FEATURE_FLAGS.YOUTH_RISK_ASSESSMENT,
    assessmentSections:
      personEscortRecord || !move._is_youth_move
        ? sortBy(combinedAssessmentSections, 'order')
        : sortBy(youthAssessmentSections, 'order'),
    moveSummary: presenters.moveToMetaListComponent(move, updateActions),
    personalDetailsSummary: presenters.personToSummaryListComponent(person),
    additionalInfoSummary: presenters.moveToAdditionalInfoListComponent(move),
    tagList: presenters.assessmentToTagList(assessmentAnswers, moveUrl),
    importantEventsTagList: presenters.moveToImportantEventsTagListComponent(
      move
    ),
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
