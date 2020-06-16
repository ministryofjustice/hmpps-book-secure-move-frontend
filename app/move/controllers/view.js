const { get, sortBy } = require('lodash')

const presenters = require('../../../common/presenters')
const updateSteps = require('../steps/update')

const getUpdateLinks = require('./view/view.update.links')
const getUpdateUrls = require('./view/view.update.urls')

module.exports = function view(req, res) {
  const { move } = res.locals
  const {
    person,
    status,
    cancellation_reason: cancellationReason,
    cancellation_reason_comment: cancellationComments,
    rejection_reason: rejectionReason,
  } = move
  const bannerStatuses = ['cancelled']
  const userPermissions = get(req.session, 'user.permissions')
  const updateUrls = getUpdateUrls(updateSteps, move.id, userPermissions)
  const updateActions = getUpdateLinks(updateSteps, updateUrls)
  const assessmentAnswers = get(person, 'assessment_answers', [])

  const urls = {
    update: updateUrls,
  }

  const locals = {
    moveSummary: presenters.moveToMetaListComponent(move, updateActions),
    personalDetailsSummary: presenters.personToSummaryListComponent(person),
    tagList: presenters.assessmentToTagList(assessmentAnswers),
    assessment: presenters
      .assessmentAnswersByCategory(assessmentAnswers)
      .map(presenters.assessmentCategoryToPanelComponent),
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
