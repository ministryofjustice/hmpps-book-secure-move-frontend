const presenters = require('../../common/presenters')

module.exports = {
  get: (req, res) => {
    const { move } = res.locals
    const { person } = move
    const locals = {
      fullname: `${person.last_name}, ${person.first_names}`,
      moveSummary: presenters.moveToMetaListComponent(move),
      personalDetailsSummary: presenters.personToSummaryListComponent(person),
    }

    res.render('moves/detail', locals)
  },
}
