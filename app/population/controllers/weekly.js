function weekly(req, res) {
  const { context, dateRange, pagination, resultsAsPopulationTables } = req

  const { period } = req.params

  res.render('population/views/weekly', {
    context,
    pageTitle: 'dashboard::page_title',
    pagination,
    resultsAsPopulationTables,
    period,
    dateRange,
  })
}

module.exports = weekly
