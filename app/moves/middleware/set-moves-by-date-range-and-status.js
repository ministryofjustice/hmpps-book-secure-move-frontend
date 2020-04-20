const moveService = require('../../../common/services/move')

async function setMovesByDateRangeAndStatus(req, res, next) {
  const { dateRange } = res.locals
  const { status, locationId } = req.params

  if (!dateRange) {
    return next()
  }

  try {
    res.locals.movesByRangeAndStatus = await moveService.getMovesByDateRangeAndStatus(
      {
        dateRange,
        status,
        fromLocationId: locationId,
      }
    )

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setMovesByDateRangeAndStatus
