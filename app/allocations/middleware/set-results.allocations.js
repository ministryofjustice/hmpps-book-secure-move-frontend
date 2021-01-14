const presenters = require('../../../common/presenters')

async function setResultsAllocations(req, res, next) {
  const hasAssignerPermission = req.canAccess('allocation:person:assign')
  const displayConfig = {
    showFromLocation: !hasAssignerPermission,
    showRemaining: hasAssignerPermission,
    query: req.query,
  }

  try {
    req.results = await req.services.allocation.getByDateAndLocation(
      req.body.allocations
    )
    req.resultsAsTable = presenters.allocationsToTableComponent(displayConfig)(
      req.results.data
    )

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsAllocations
