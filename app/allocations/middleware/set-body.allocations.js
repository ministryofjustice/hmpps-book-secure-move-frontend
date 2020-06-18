const { map, set, get } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function setBodyAllocations(req, res, next) {
  const { status, sortBy, sortDirection } = req.query
  const { dateRange } = req.params

  const locations = get(req.session, 'currentRegion.locations', [])

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
