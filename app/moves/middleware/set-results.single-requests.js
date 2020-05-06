const presenters = require('../../../common/presenters')
const singleRequestService = require('../../../common/services/single-request')

async function setResultsSingleRequests(req, res, next) {
  const { dateRange } = res.locals
  const { status, locationId } = req.params

  if (!dateRange) {
    return next()
  }

  try {
    const singleRequests = await singleRequestService.getAll({
      status,
      createdAtDate: dateRange,
      fromLocationId: locationId,
    })

    req.results = {
      active: singleRequests,
      cancelled: [],
    }
    req.resultsAsTable = {
      active: presenters.movesToTable(singleRequests),
      cancelled: [],
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsSingleRequests
