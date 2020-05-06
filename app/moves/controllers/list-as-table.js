const { find, sumBy } = require('lodash')

module.exports = function listAsTable(req, res) {
  const { filter, resultsAsTable } = req
  const activeFilter = find(filter, { active: true }) || {}

  res.render('moves/views/list-as-table', {
    filter,
    resultsAsTable,
    pageTitle: 'moves::dashboard.single_moves',
    activeContext: activeFilter.status,
    totalResults: sumBy(filter, 'value'),
  })
}
