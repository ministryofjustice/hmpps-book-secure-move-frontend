const presenters = require('../../../common/presenters')

module.exports = function view(req, res) {
  const { move } = res.locals
  const {
    person,
    cancellation_reason: cancellationReason,
    cancellation_reason_comments: cancellationComments,
  } = move
  const locals = {
    moveSummary: presenters.moveToMetaListComponent(move),
    personalDetailsSummary: presenters.personToSummaryListComponent(person),
    tagList: presenters.assessmentToTagList(person.assessment_answers),
    assessment: presenters.assessmentByCategory(person.assessment_answers),
    courtSummary: presenters.assessmentToSummaryListComponent(
      person.assessment_answers,
      'court'
    ),
  }

  if (cancellationReason) {
    const reasonLabel = req.t(
      `fields::cancellation_reason.items.${cancellationReason}.label`
    )

    locals.cancellationReason =
      cancellationReason !== 'other' ? reasonLabel : cancellationComments
  }

  res.render('move/views/view', locals)
}
