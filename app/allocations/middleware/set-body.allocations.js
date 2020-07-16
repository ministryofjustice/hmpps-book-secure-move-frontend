const { map, set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')
const permissions = require('../../../common/middleware/permissions')

function setBodyAllocations(req, res, next) {
  const { status, sortBy, sortDirection } = req.query
  const { dateRange } = req.params
  const userPermissions = req?.session?.user?.permissions
  const hasAssignerPermission = permissions.check(
    'allocation:person:assign',
    userPermissions
  )
  const locationType = hasAssignerPermission ? 'fromLocations' : 'locations'

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
    [locationType]: map(locations, 'id'),
  })

  next()
}

module.exports = setBodyAllocations
