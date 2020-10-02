const dateHelpers = require('../../../common/helpers/date')

function dashboard(req, res) {
  const currentWeek = dateHelpers.getCurrentWeekAsRange()
  const today = new Date().toISOString()

  res.render('population/view/dashboard', {
    pageTitle: 'dashboard::page_title',
    capacitiesAsTable: req.capacitiesAsTable,
    currentWeek,
    today,
  })
}

module.exports = dashboard
