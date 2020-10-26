const dateHelpers = require('../../../common/helpers/date')

function dashboard(req, res) {
  const currentWeek = dateHelpers.getCurrentWeekAsRange()
  const today = new Date().toISOString()

  const { context, dateRange, pagination, resultsAsPopulationTable } = req
  const { period } = req.params

  res.render('population/view/dashboard', {
    context,
    pageTitle: 'dashboard::page_title',
    pagination,
    resultsAsPopulationTable,
    period,
    currentWeek: dateRange,
    today,
  })
}

module.exports = dashboard
