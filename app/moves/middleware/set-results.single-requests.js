const presenters = require('../../../common/presenters')

async function setResultsSingleRequests(req, res, next) {
  const singleRequestService = req.services.singleRequest

  try {
    const singleRequests = await singleRequestService.getAll(req.body.requested)

    req.resultsAsTable = presenters.singleRequestsToTableComponent({
      query: req.query,
    })(singleRequests)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsSingleRequests
