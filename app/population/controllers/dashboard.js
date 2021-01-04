function dashboard(req, res) {
  const { context, dateRange, datePagination, resultsAsPopulationTables } = req
  const { period } = req.params

  res.render('population/views/dashboard', {
    context,
    pageTitle: 'dashboard::page_title',
    datePagination,
    resultsAsPopulationTables,
    period,
    dateRange,
  })
}

module.exports = dashboard
