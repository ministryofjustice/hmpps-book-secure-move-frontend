const { get } = require('lodash')

const permissions = require('../../../common/middleware/permissions')
const presenters = require('../../../common/presenters')
const allocationService = require('../../../common/services/allocation')

async function setResultsAllocations(req, res, next) {
  const currentLocationId = get(req.session, 'currentLocation.id')
  const userPermissions = get(req.session, 'user.permissions')
  const displayConfig = {
    showRemaining: permissions.check(
      'allocation:person:assign',
      userPermissions
    ),
    showFromLocation: !currentLocationId,
  }

  try {
    const [activeAllocations, cancelledAllocations] = (
      await Promise.all([
        allocationService.getActive(req.body.allocations),
        allocationService.getCancelled(req.body.allocations),
      ])
    ).map(response => response.flat())

    req.results = {
      active: activeAllocations,
      cancelled: cancelledAllocations,
    }
    req.resultsAsTable = {
      active: presenters.allocationsToTableComponent(displayConfig)(
        activeAllocations
      ),
      cancelled: presenters.allocationsToTableComponent(displayConfig)(
        cancelledAllocations
      ),
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsAllocations
