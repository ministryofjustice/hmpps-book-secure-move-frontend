const presenters = require('../../common/presenters')

module.exports = {
  get: (req, res, next) => {
    const params = {
      personalDetailsSummary: presenters.personToSummaryListComponent(res.locals.move.person),
    }
    res.render('moves/detail', params)
  },
}
