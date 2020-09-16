const { omitBy, isUndefined, isString } = require('lodash')

const presenters = require('../../../common/presenters')
const singleRequestService = require('../../../common/services/single-request')

async function setResultsSingleRequests(req, res, next) {
  try {
    const [singleRequests, cancelledRequests] = await Promise.all([
      singleRequestService.getAll(omitBy(req.body.requested, isUndefined)),
      singleRequestService.getCancelled(req.body.requested),
    ])

    const query = req.query
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
      active: presenters.singleRequestsToTableComponent({ query })(
        singleRequests
      ),
      cancelled: presenters.singleRequestsToTableComponent({
        isSortable: false,
      })(cancelledMoves),
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsSingleRequests
