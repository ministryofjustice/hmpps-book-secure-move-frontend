const { find, sumBy } = require('lodash')

const presenters = require('../../../common/presenters')

module.exports = function listAsTable(req, res) {
  const { filter } = req
  const { movesByRangeAndStatus = [] } = res.locals
  const template = 'moves/views/list-as-table'
  const locals = {
    filter,
    pageTitle: 'moves::dashboard.single_moves',
    activeContext: find(filter, { active: true }).status,
    totalResults: sumBy(filter, 'value'),
    resultsAsTable: {
      active: presenters.movesToTable(movesByRangeAndStatus),
    },
  }

  res.render(template, locals)
}
