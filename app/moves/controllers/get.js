const presenters = require('../../../common/presenters')

module.exports = function get (req, res) {
  const { move } = res.locals
  const { person } = move
  const locals = {
    fullname: `${person.last_name}, ${person.first_names}`,
    moveSummary: presenters.moveToMetaListComponent(move),
    personalDetailsSummary: presenters.personToSummaryListComponent(person),
    tagList: presenters.assessmentToTagList(person.assessment_answers),
    assessment: presenters.assessmentByCategory(person.assessment_answers),
    courtSummary: presenters.assessmentToSummaryListComponent(person.assessment_answers, 'court'),
  }

  res.render('moves/views/detail', locals)
}
