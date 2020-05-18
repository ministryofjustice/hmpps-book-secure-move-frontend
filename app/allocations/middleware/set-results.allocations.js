const presenters = require('../../../common/presenters')
const allocationService = require('../../../common/services/allocation')

async function setResultsAllocations(req, res, next) {
  try {
    const allocations = await allocationService.getByDateAndLocation(
      req.body.allocations
    )

    req.results = {
      active: allocations,
      cancelled: [],
    }
    req.resultsAsTable = {
      active: presenters.allocationsToTable(allocations),
      cancelled: [],
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsAllocations
