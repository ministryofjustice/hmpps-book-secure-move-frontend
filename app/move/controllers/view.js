const { sortBy } = require('lodash')

const presenters = require('../../../common/presenters')
const updateSteps = require('../steps/update')

module.exports = function view(req, res) {
  const { move } = res.locals
  const {
    person,
    status,
    cancellation_reason: cancellationReason,
    cancellation_reason_comment: cancellationComments,
  } = move
  const reason =
    cancellationReason === 'other'
      ? cancellationComments
      : req.t(`fields::cancellation_reason.items.${cancellationReason}.label`)
  const bannerStatuses = ['cancelled']
  const urls = {
    update: {},
  }
  updateSteps.forEach(step => {
    const url = Object.keys(step)[0].replace(/^\//, '')
    const key = url.replace(/-/g, '_')
    urls.update[key] = `/move/${move.id}/edit/${url}`
    // some assessment categories aren't suffixed with _information
    if (key.endsWith('_information')) {
      const keyWithoutInformation = key.replace(/_information$/, '')
      urls.update[keyWithoutInformation] = urls.update[key]
    }
  })

  const locals = {
    moveSummary: presenters.moveToMetaListComponent(move),
    personalDetailsSummary: presenters.personToSummaryListComponent(person),
    tagList: presenters.assessmentToTagList(person.assessment_answers),
    assessment: presenters
      .assessmentAnswersByCategory(person.assessment_answers)
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
      person.assessment_answers,
      'court'
    ),
    messageTitle: bannerStatuses.includes(status)
      ? req.t('statuses::' + status)
      : undefined,
    messageContent: req.t('statuses::description', {
      context: status,
      reason,
    }),
    urls,
  }

  res.render('move/views/view', locals)
}
