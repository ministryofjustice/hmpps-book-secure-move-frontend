const { sortBy } = require('lodash')

const presenters = require('../../../common/presenters')

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
  const locals = {
    moveSummary: presenters.moveToMetaListComponent(move),
    personalDetailsSummary: presenters.personToSummaryListComponent(person),
    tagList: presenters.assessmentToTagList(person.assessment_answers),
    assessment: presenters.assessmentByCategory(person.assessment_answers),
    courtHearings: sortBy(move.hearings, 'start_time').map(hearing => {
      return {
        ...hearing,
        summaryList: presenters.courtHearingToSummaryListComponent(hearing),
      }
    }),
    courtSummary: presenters.assessmentToSummaryListComponent(
      person.assessment_answers,
      'court'
    ),
    messageTitle: req.t('statuses::' + status),
    messageContent: req.t('statuses::description', {
      context: status,
      reason,
    }),
  }

  res.render('move/views/view', locals)
}
