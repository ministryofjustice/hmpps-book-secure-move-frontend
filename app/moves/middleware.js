const { get } = require('lodash')
const { format } = require('date-fns')

const moveService = require('../../common/services/move')

module.exports = {
  setMoveDate: (req, res, next) => {
    res.locals.moveDate =
      req.query['move-date'] || format(new Date(), 'YYYY-MM-DD')

    next()
  },
  setMovesByDateAndLocation: async (req, res, next) => {
    const { moveDate } = res.locals

    if (!moveDate) {
      return next()
    }

    try {
      res.locals.movesByDate = await moveService.getRequestedMovesByDateAndLocation(
        moveDate,
        get(req.session, 'currentLocation.id')
      )

      next()
    } catch (error) {
      next(error)
    }
  },
}
