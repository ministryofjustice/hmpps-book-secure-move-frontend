function daily(req, res) {
  const { context, resultsAsDailySummary } = req

  res.render('population/view/daily', {
    context,
    pageTitle: 'dashboard::page_title',
    resultsAsDailySummary,
  })
}

module.exports = daily
