function dashboard(req, res) {
  const { context, dateRange, pagination, resultsAsPopulationTable } = req
  const { period } = req.params

  res.render('population/views/dashboard', {
    context,
    pageTitle: 'dashboard::page_title',
    pagination,
    resultsAsPopulationTable,
    period,
    dateRange,
  })
}

module.exports = dashboard
