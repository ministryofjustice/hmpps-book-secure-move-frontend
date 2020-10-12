const presenters = require('../../../common/presenters')
const allocationService = require('../../../common/services/allocation')

async function setResultsAllocations(req, res, next) {
  const hasAssignerPermission = req.canAccess('allocation:person:assign')
  const query = req.query

  const displayConfig = {
    showFromLocation: !hasAssignerPermission,
    showRemaining: hasAssignerPermission,
    query,
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
      cancelled: presenters.allocationsToTableComponent({
        ...displayConfig,
        isSortable: false,
      })(cancelledAllocations),
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsAllocations
