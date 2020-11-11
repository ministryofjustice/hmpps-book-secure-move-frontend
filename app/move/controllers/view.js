const { isEmpty, find, sortBy } = require('lodash')

const presenters = require('../../../common/presenters')
const updateSteps = require('../steps/update')

const getTabsUrls = require('./view/view.tabs.urls')
const getUpdateLinks = require('./view/view.update.links')
const getUpdateUrls = require('./view/view.update.urls')

module.exports = function view(req, res) {
  const { move, originalUrl, framework = {} } = req
  const {
    profile,
    status,
    cancellation_reason: cancellationReason,
    cancellation_reason_comment: cancellationComments,
    rejection_reason: rejectionReason,
  } = move

  // We have to pretend that 'secure_childrens_home', 'secure_training_centre' are valid `move_type`s
  const youthTransfer = ['secure_childrens_home', 'secure_training_centre']
  const toLocationType = move?.to_location?.location_type
  const fromLocationType = move?.from_location?.location_type

  if (toLocationType === 'prison' && youthTransfer.includes(fromLocationType)) {
    move.move_type = fromLocationType
  }

  const bannerStatuses = ['cancelled']
  const updateUrls = getUpdateUrls(updateSteps, move, req)
  const updateActions = getUpdateLinks(updateSteps, updateUrls)
  const {
    person,
    assessment_answers: assessmentAnswers = [],
    person_escort_record: personEscortRecord,
  } = profile || {}
  const personEscortRecordIsEnabled = req.canAccess('person_escort_record:view')
  const personEscortRecordIsCompleted =
    !isEmpty(personEscortRecord) &&
    !['not_started', 'in_progress'].includes(personEscortRecord?.status)
  const personEscortRecordIsConfirmed = ['confirmed'].includes(
    personEscortRecord?.status
  )
  const personEscortRecordUrl = `${originalUrl}/person-escort-record`
  const showPersonEscortRecordBanner =
    personEscortRecordIsEnabled &&
    !['proposed'].includes(move?.status) &&
    move.profile?.id !== undefined
  const canStartPersonEscortRecord =
    showPersonEscortRecordBanner &&
    ['requested', 'booked'].includes(move?.status) &&
    !personEscortRecord
  const canConfirmPersonEscortRecord =
    showPersonEscortRecordBanner &&
    personEscortRecordIsCompleted &&
    ['requested', 'booked'].includes(move?.status)
  const personEscortRecordtaskList = presenters.frameworkToTaskListComponent({
    baseUrl: `${personEscortRecordUrl}/`,
    deepLinkToFirstStep: true,
    frameworkSections: framework.sections,
    sectionProgress: personEscortRecord?.meta?.section_progress,
  })
  const personEscortRecordTagList = presenters.frameworkFlagsToTagList(
    personEscortRecord?.flags
  )
  const urls = {
    update: updateUrls,
    tabs: getTabsUrls(move),
  }
  const assessment = presenters
    .assessmentAnswersByCategory(assessmentAnswers)
    .filter(category => category.key !== 'court')
    .map(presenters.assessmentCategoryToPanelComponent)
  const courtSummary = presenters
    .assessmentAnswersByCategory(assessmentAnswers)
    .filter(category => category.key === 'court')
    .map(presenters.assessmentCategoryToSummaryListComponent)[0]
  const assessmentSections = sortBy(framework.sections, 'order')
    .map(
      presenters.frameworkSectionToPanelList({
        tagList: personEscortRecordTagList,
        questions: framework.questions,
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
    assessment,
    courtSummary,
    personEscortRecord,
    personEscortRecordIsEnabled,
    personEscortRecordIsCompleted,
    personEscortRecordIsConfirmed,
    personEscortRecordUrl,
    personEscortRecordtaskList,
    showPersonEscortRecordBanner,
    canStartPersonEscortRecord,
    canConfirmPersonEscortRecord,
    personEscortRecordTagList,
    assessmentSections,
    moveSummary: presenters.moveToMetaListComponent(move, updateActions),
    personalDetailsSummary: presenters.personToSummaryListComponent(person),
    additionalInfoSummary: presenters.moveToAdditionalInfoListComponent(move),
    tagList: presenters.assessmentToTagList(assessmentAnswers),
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
    }),
    updateLinks: updateActions,
    urls,
  }

  res.render('move/views/view', locals)
}
