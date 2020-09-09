const { omitBy, isUndefined, isString } = require('lodash')

const presenters = require('../../../common/presenters')
const singleRequestService = require('../../../common/services/single-request')

async function setResultsSingleRequests(req, res, next) {
  try {
    const [singleRequests, cancelledRequests] = await Promise.all([
      singleRequestService.getAll(omitBy(req.body.requested, isUndefined)),
      singleRequestService.getCancelled(req.body.requested),
    ])

    let cancelledMoves

    const status = req?.body?.requested?.status

    switch (status) {
      case 'pending': {
        cancelledMoves = cancelledRequests.filter(it => !isString(it.date))
        break
      }

      case 'approved': {
        cancelledMoves = cancelledRequests.filter(it => isString(it.date))
        break
      }

      case 'rejected':
      default:
        cancelledMoves = []
        break
    }

    req.resultsAsTable = {
      active: presenters.singleRequestsToTableComponent(singleRequests),
      cancelled:
        cancelledMoves.length > 0
          ? presenters.singleRequestsToTableComponent(cancelledMoves)
          : [],
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsSingleRequests
