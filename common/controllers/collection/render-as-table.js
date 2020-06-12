const { sumBy } = require('lodash')

module.exports = function listAsTable(req, res) {
  const { actions, context, filter, pagination, resultsAsTable } = req
  const { dateRange, period } = req.params

  res.render('collection-as-table', {
    actions,
    context,
    dateRange,
    filter,
    pagination,
    period,
    resultsAsTable,
    activeStatus: req.query.status,
    totalResults: sumBy(filter, 'value'),
  })
}
