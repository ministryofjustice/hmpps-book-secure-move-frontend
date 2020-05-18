module.exports = function list(req, res) {
  const { filter, pagination, resultsAsTable } = req
  const template = 'allocations/views/list'
  const locals = {
    filter,
    pagination,
    resultsAsTable,
    pageTitle: req.t('allocations::dashboard.heading'),
  }

  res.render(template, locals)
}
