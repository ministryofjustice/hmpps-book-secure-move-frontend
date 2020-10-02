const { sortBy } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function dashboard(req, res) {
  const currentWeek = dateHelpers.getCurrentWeekAsRange()
  const today = new Date().toISOString()

  const sections = {
    outgoing: {
      permission: 'moves:view:outgoing',
      heading: 'dashboard::sections.outgoing.heading',
      filter: req.filterOutgoing,
      period: 'day',
    },
    incoming: {
      permission: 'moves:view:incoming',
      heading: 'dashboard::sections.incoming.heading',
      filter: req.filterIncoming,
      period: 'day',
    },
    singleRequests: {
      permission: 'moves:view:proposed',
      heading: 'dashboard::sections.single_requests.heading',
      filter: req.filterSingleRequests,
      period: 'week',
    },
    allocations: {
      permission: 'allocations:view',
      heading: 'dashboard::sections.allocations.heading',
      filter: req.filterAllocations,
      period: 'week',
    },
  }

  const userLocations = req.userLocations
  const population = sortBy(userLocations, 'title')

  console.log(population)
  // const population = []

  res.render('home/dashboard', {
    pageTitle: 'dashboard::page_title',
    sections,
    population,
    capacitiesAsTable: req.capacitiesAsTable,
    currentWeek,
    today,
  })
}

module.exports = {
  dashboard,
}
