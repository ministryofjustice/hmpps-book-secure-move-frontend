const { sortBy } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function view(req, res) {
  const currentWeek = dateHelpers.getCurrentWeekAsRange()
  const today = new Date().toISOString()

  // const userLocations = req.userLocations
  // const population = sortBy(userLocations, 'title')
  // const population = []

  res.render('population/view/view', {
    pageTitle: 'dashboard::page_title',
    capacitiesAsTable: req.capacitiesAsTable,
    currentWeek,
    today,
  })
}

module.exports = view
