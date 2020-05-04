const { find, sumBy } = require('lodash')

const presenters = require('../../../common/presenters')

module.exports = function list(req, res) {
  const { movesByRangeAndStatus = [] } = res.locals
  const template = 'moves/views/list-as-table'
  const locals = {
    pageTitle: 'moves::dashboard.single_moves',
    activeContext: find(res.locals.moveTypeNavigation, { active: true }).filter,
    totalMoves: sumBy(res.locals.moveTypeNavigation, 'value'),
    movesAsTable: presenters.movesToTable(movesByRangeAndStatus),
  }

  res.render(template, locals)
}
