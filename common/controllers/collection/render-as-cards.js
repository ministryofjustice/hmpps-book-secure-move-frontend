const { sumBy } = require('lodash')

module.exports = function listAsCards(req, res) {
  const {
    actions,
    context,
    datePagination,
    filter,
    params,
    resultsAsCards,
    query,
  } = req
  const { dateRange, locationId, period } = params
  const canViewMove = req.canAccess('move:view')
  const template =
    canViewMove && locationId ? 'collection-as-cards' : 'moves/views/download'
  const locals = {
    actions,
    context,
    filter,
    dateRange,
    datePagination,
    period,
    resultsAsCards,
    activeStatus: query.status,
    totalResults: sumBy(filter, 'value'),
  }

  res.render(template, locals)
}
