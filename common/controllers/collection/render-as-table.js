const { sumBy } = require('lodash')

module.exports = function listAsTable(req, res) {
  const { actions, context, filter, pagination, resultsAsTable } = req

  res.render('collection-as-table', {
    actions,
    activeStatus: req.query.status,
    context,
    filter,
    pagination,
    resultsAsTable,
    totalResults: sumBy(filter, 'value'),
  })
}
