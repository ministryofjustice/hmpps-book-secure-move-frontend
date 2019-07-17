const { format } = require('date-fns')

const moveService = require('../../common/services/move')

module.exports = {
  setMoveDate: (req, res, next) => {
    res.locals.moveDate =
      req.query['move-date'] || format(new Date(), 'YYYY-MM-DD')

    next()
  },
  setFromLocation: (req, res, next, locationId) => {
    res.locals.fromLocationId = locationId
    next()
  },
  setMovesByDate: async (req, res, next) => {
    const { moveDate } = res.locals

    if (!moveDate) {
      return next()
    }

    try {
      res.locals.movesByDate = await moveService.getRequestedMovesByDateAndLocation(
        moveDate,
        res.locals.fromLocationId
      )

      next()
    } catch (error) {
      next(error)
    }
  },
}
