function weekly(req, res) {
  const { context, dateRange, datePagination, resultsAsPopulationTables } = req

  const { period } = req.params

  res.render('population/views/weekly', {
    context,
    pageTitle: 'dashboard::page_title',
    datePagination,
    resultsAsPopulationTables,
    period,
    dateRange,
  })
}

module.exports = weekly
