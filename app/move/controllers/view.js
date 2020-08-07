const { isEmpty, find, sortBy } = require('lodash')

const permissionsMiddleware = require('../../../common/middleware/permissions')
const presenters = require('../../../common/presenters')
const { FEATURE_FLAGS } = require('../../../config')
const updateSteps = require('../steps/update')

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
  const bannerStatuses = ['cancelled']
  const userPermissions = req.session?.user?.permissions
  const updateUrls = getUpdateUrls(updateSteps, move.id, userPermissions)
  const updateActions = getUpdateLinks(updateSteps, updateUrls)
  const {
    person,
    assessment_answers: assessmentAnswers = [],
    person_escort_record: personEscortRecord,
  } = profile || {}
  const personEscortRecordIsEnabled =
    FEATURE_FLAGS.PERSON_ESCORT_RECORD &&
    permissionsMiddleware.check('person_escort_record:view', userPermissions)
  const personEscortRecordIsCompleted =
    !isEmpty(personEscortRecord) &&
    !['not_started', 'in_progress'].includes(personEscortRecord?.status)
  const personEscortRecordIsConfirmed = ['confirmed'].includes(
    personEscortRecord?.status
  )
  const personEscortRecordUrl = `${originalUrl}/person-escort-record`
  const showPersonEscortRecordBanner =
    personEscortRecordIsEnabled &&
    ['requested', 'booked'].includes(move?.status) &&
    move.profile?.id !== undefined
  const personEscortRecordtaskList = presenters.frameworkToTaskListComponent({
    baseUrl: `${personEscortRecordUrl}/`,
    frameworkSections: framework.sections,
    sectionProgress: personEscortRecord?.meta?.section_progress,
  })
  const personEscortRecordTagList = presenters.frameworkFlagsToTagList(
    personEscortRecord?.flags
  )
  const urls = {
    update: updateUrls,
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
