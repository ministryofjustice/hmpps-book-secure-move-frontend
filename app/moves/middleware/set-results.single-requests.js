const presenters = require('../../../common/presenters')
const singleRequestService = require('../../../common/services/single-request')

async function setResultsSingleRequests(req, res, next) {
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
