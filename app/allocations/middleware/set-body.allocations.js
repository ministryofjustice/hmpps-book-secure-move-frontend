const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function setBodyAllocations(req, res, next) {
  const { status, sortBy, sortDirection } = req.query
  const { dateRange } = req.params
  const hasAssignerPermission = req.canAccess('allocation:person:assign')
  const locationType = hasAssignerPermission ? 'fromLocations' : 'locations'
  const locations = req.locations

  set(req, 'body.allocations', {
    status,
    sortBy,
    sortDirection,
    moveDate: dateRange || dateHelpers.getCurrentWeekAsRange(),
    [locationType]: locations,
  })

  next()
}

module.exports = setBodyAllocations
