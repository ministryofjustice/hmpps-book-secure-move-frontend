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
  const { dateRange, period } = params
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

  res.render('collection-as-cards', locals)
}
