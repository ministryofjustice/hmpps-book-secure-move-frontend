const singleRequestService = require('../../../common/services/single-request')

async function setMovesByDateRangeAndStatus(req, res, next) {
  const { dateRange } = res.locals
  const { status, locationId } = req.params

  if (!dateRange) {
    return next()
  }

  try {
    res.locals.movesByRangeAndStatus = await singleRequestService.getAll({
      status,
      createdAtDate: dateRange,
      fromLocationId: locationId,
    })

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = setMovesByDateRangeAndStatus
