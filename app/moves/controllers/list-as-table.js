const { find, sumBy } = require('lodash')

const presenters = require('../../../common/presenters')

module.exports = function listAsTable(req, res) {
  const { movesByRangeAndStatus = [] } = res.locals
  const template = 'moves/views/list-as-table'
  const locals = {
    pageTitle: 'moves::dashboard.single_moves',
    activeContext: find(res.locals.moveTypeNavigation, { active: true }).filter,
    totalResults: sumBy(res.locals.moveTypeNavigation, 'value'),
    resultsAsTable: {
      active: presenters.movesToTable(movesByRangeAndStatus),
    },
  }

  res.render(template, locals)
}
