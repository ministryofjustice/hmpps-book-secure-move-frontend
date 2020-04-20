const { chunk, get } = require('lodash')

const moveService = require('../../../common/services/move')
const { LOCATIONS_BATCH_SIZE } = require('../../../config')

function makeMultipleRequests(service, dateRange, locationIdBatches) {
  return Promise.all(
    locationIdBatches.map(chunk =>
      service({ dateRange, fromLocationId: chunk })
    )
  )
}

async function setMovesByDateAllLocations(req, res, next) {
  const { dateRange } = res.locals

  if (!dateRange) {
    return next()
  }

  try {
    const userLocations = get(req.session, 'user.locations', []).map(
      location => location.id
    )

    if (userLocations.length === 0) {
      return next()
    }

    const idChunks = chunk(userLocations, LOCATIONS_BATCH_SIZE).map(id =>
      id.join(',')
    )

    const [activeMoves, cancelledMoves] = (
      await Promise.all([
        makeMultipleRequests(moveService.getActive, dateRange, idChunks),
        makeMultipleRequests(moveService.getCancelled, dateRange, idChunks),
      ])
    ).map(response => response.flat())

    res.locals.activeMovesByDate = activeMoves
    res.locals.cancelledMovesByDate = cancelledMoves
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setMovesByDateAllLocations
