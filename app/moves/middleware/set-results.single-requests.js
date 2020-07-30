const { omitBy, isUndefined } = require('lodash')

const presenters = require('../../../common/presenters')
const singleRequestService = require('../../../common/services/single-request')

async function setResultsSingleRequests(req, res, next) {
  try {
    const singleRequests = await singleRequestService.getAll(
      omitBy(
        {
          ...req.body.requested,
          supplierId: req.session?.user?.supplierId,
        },
        isUndefined
      )
    )

    req.resultsAsTable = {
      active: presenters.singleRequestsToTableComponent(singleRequests),
      cancelled: [],
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsSingleRequests
