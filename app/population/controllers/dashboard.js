function dashboard(req, res) {
  const { context, dateRange, pagination, resultsAsPopulationTables } = req
  const { period } = req.params

  res.render('population/views/dashboard', {
    context,
    pageTitle: 'dashboard::page_title',
    pagination,
    resultsAsPopulationTables,
    period,
    dateRange,
  })
}

module.exports = dashboard
