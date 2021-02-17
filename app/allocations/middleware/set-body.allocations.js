const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function setBodyAllocations(req, res, next) {
  const { status, sortBy, sortDirection, page = 1 } = req.query
  const { dateRange } = req.params
  const hasAssignerPermission = req.canAccess('allocation:person:assign')
  const locationType = hasAssignerPermission ? 'fromLocations' : 'locations'
  const locations = req.locations

  const { location } = req
  const bodyLocations = location?.id ? [location.id] : locations

  set(req, 'body.allocations', {
    page,
    status,
    sortBy,
    sortDirection,
    moveDate: dateRange || dateHelpers.getCurrentWeekAsRange(),
    [locationType]: bodyLocations,
  })

  next()
}

module.exports = setBodyAllocations
