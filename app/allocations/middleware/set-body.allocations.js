const { map, set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function setBodyAllocations(req, res, next) {
  const { status, sortBy, sortDirection } = req.query
  const { dateRange } = req.params

  let locations = req?.session?.currentRegion?.locations

  if (!locations) {
    const currentLocation = req?.session?.currentLocation

    if (currentLocation) {
      locations = [currentLocation]
    }
  }

  set(req, 'body.allocations', {
    status,
    sortBy,
    sortDirection,
    moveDate: dateRange || dateHelpers.getCurrentWeekAsRange(),
    locations: map(locations, 'id'),
  })

  next()
}

module.exports = setBodyAllocations
