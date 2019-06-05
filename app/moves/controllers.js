const presenters = require('../../common/presenters')

module.exports = {
  get: (req, res) => {
    const { person } = res.locals.move
    const params = {
      fullname: `${person.last_name}, ${person.first_names}`,
      personalDetailsSummary: presenters.personToSummaryListComponent(person),
    }

    res.render('moves/detail', params)
  },
}
