const moveService = require('../../../common/services/move')

async function setMovesByDateAndLocation(req, res, next) {
  const { dateRange, fromLocationId } = res.locals

  if (!dateRange) {
    return next()
  }

  try {
    const [activeMoves, cancelledMoves] = await Promise.all([
      moveService.getActive({ dateRange, fromLocationId }),
      moveService.getCancelled({ dateRange, fromLocationId }),
    ])

    res.locals.activeMovesByDate = activeMoves
    res.locals.cancelledMovesByDate = cancelledMoves

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setMovesByDateAndLocation
