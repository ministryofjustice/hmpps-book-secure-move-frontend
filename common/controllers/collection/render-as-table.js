const { sumBy } = require('lodash')

module.exports = function listAsTable(req, res) {
  const { actions, context, filter, pagination, resultsAsTable } = req

  res.render('collection-as-table', {
    actions,
    context,
    filter,
    pagination,
    resultsAsTable,
    activeStatus: req.query.status,
    totalResults: sumBy(filter, 'value'),
  })
}
