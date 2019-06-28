const personService = require('../../../common/services/person')
const presenters = require('../../../common/presenters')

module.exports = function detail (req, res) {
  const { move } = res.locals
  const { person } = move
  const locals = {
    fullname: personService.getFullname(person),
    moveSummary: presenters.moveToMetaListComponent(move),
    personalDetailsSummary: presenters.personToSummaryListComponent(person),
    tagList: presenters.assessmentToTagList(person.assessment_answers),
    assessment: presenters.assessmentByCategory(person.assessment_answers),
    courtSummary: presenters.assessmentToSummaryListComponent(person.assessment_answers, 'court'),
  }

  res.render('moves/views/detail', locals)
}
