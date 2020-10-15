const presenters = require('../../../common/presenters')
const allocationService = require('../../../common/services/allocation')

async function setResultsAllocations(req, res, next) {
  const hasAssignerPermission = req.canAccess('allocation:person:assign')
  const displayConfig = {
    showFromLocation: !hasAssignerPermission,
    showRemaining: hasAssignerPermission,
    query: req.query,
  }

  try {
    const results = await allocationService.getByDateAndLocation(
      req.body.allocations
    )

    req.resultsAsTable = presenters.allocationsToTableComponent(displayConfig)(
      results
    )

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsAllocations
