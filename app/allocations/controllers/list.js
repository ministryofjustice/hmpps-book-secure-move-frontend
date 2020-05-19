const { sumBy } = require('lodash')

module.exports = function list(req, res) {
  const { filter, pagination, resultsAsTable } = req
  const template = 'allocations/views/list'
  const locals = {
    filter,
    pagination,
    resultsAsTable,
    pageTitle: req.t('allocations::dashboard.heading'),
    totalResults: sumBy(filter, 'value'),
  }

  res.render(template, locals)
}
