const { sumBy } = require('lodash')

module.exports = function listAsTable(req, res) {
  const {
    actions,
    datePagination,
    context,
    filter,
    pagination,
    resultsAsTable,
  } = req
  const { dateRange, period } = req.params

  res.render('collection-as-table', {
    actions,
    context,
    datePagination,
    dateRange,
    filter,
    pagination,
    period,
    group_by: req.session.group_by,
    resultsAsTable,
    activeStatus: req.query.status,
    totalResults: sumBy(filter, 'value'),
  })
}
