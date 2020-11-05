function dashboard(req, res) {
  const { context, dateRange, pagination, resultsAsPopulationTable } = req
  const { period } = req.params

  res.render('population/view/dashboard', {
    context,
    pageTitle: 'dashboard::page_title',
    pagination,
    resultsAsPopulationTable,
    period,
    currentWeek: dateRange,
  })
}

module.exports = dashboard
