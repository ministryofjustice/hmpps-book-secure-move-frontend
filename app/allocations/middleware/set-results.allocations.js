const presenters = require('../../../common/presenters')
const allocationService = require('../../../common/services/allocation')

async function setResultsAllocations(req, res, next) {
  try {
    const [activeAllocations, cancelledAllocations] = (
      await Promise.all([
        allocationService.getActiveAllocations(req.body.allocations),
        allocationService.getCancelledAllocations(req.body.allocations),
      ])
    ).map(response => response.flat())

    req.results = {
      active: activeAllocations,
      cancelled: cancelledAllocations,
    }
    req.resultsAsTable = {
      active: presenters.allocationsToTable(activeAllocations),
      cancelled: presenters.allocationsToTable(cancelledAllocations),
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsAllocations
