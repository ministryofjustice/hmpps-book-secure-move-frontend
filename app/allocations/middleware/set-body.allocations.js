const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')
const permissions = require('../../../common/middleware/permissions')

function setBodyAllocations(req, res, next) {
  const { status, sortBy, sortDirection } = req.query
  const { dateRange } = req.params
  const userPermissions = req.session?.user?.permissions
  const hasAssignerPermission = permissions.check(
    'allocation:person:assign',
    userPermissions
  )
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
