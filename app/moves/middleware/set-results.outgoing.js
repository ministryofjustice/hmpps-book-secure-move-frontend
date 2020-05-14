const { chunk, get } = require('lodash')

const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')
const { LOCATIONS_BATCH_SIZE } = require('../../../config')

function makeMultipleRequests(service, dateRange, locationIdBatches) {
  return Promise.all(
    locationIdBatches.map(chunk =>
      service({ dateRange, fromLocationId: chunk })
    )
  )
}

async function setResultsOutgoing(req, res, next) {
  const { dateRange, locationId } = req.params

  if (!dateRange) {
    return next()
  }

  try {
    const locations = locationId
      ? [locationId]
      : get(req.session, 'user.locations', []).map(location => location.id)

    if (locations.length === 0) {
      return next()
    }

    const idChunks = chunk(locations, LOCATIONS_BATCH_SIZE).map(id =>
      id.join(',')
    )

    const [activeMoves, cancelledMoves] = (
      await Promise.all([
        makeMultipleRequests(moveService.getActive, dateRange, idChunks),
        makeMultipleRequests(moveService.getCancelled, dateRange, idChunks),
      ])
    ).map(response => response.flat())

    req.results = {
      active: activeMoves,
      cancelled: cancelledMoves,
    }
    req.resultsAsCards = {
      active: presenters.movesByToLocation(activeMoves),
      cancelled: cancelledMoves.map(
        presenters.moveToCardComponent({
          showMeta: false,
          showTags: false,
          showImage: false,
        })
      ),
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setResultsOutgoing
