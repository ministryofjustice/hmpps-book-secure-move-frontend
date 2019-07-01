const { format } = require('date-fns')

const moveService = require('../../common/services/move')

module.exports = {
  setMove: async (req, res, next, moveId) => {
    if (!moveId) {
      return next()
    }

    try {
      const move = await moveService.getMoveById(moveId)

      res.locals.move = move.data

      next()
    } catch (error) {
      next(error)
    }
  },
  setMoveDate: (req, res, next) => {
    res.locals.moveDate = req.query['move-date'] || format(new Date(), 'YYYY-MM-DD')

    next()
  },
  setMovesByDate: async (req, res, next) => {
    const { moveDate } = res.locals

    if (!moveDate) {
      return next()
    }

    try {
      res.locals.movesByDate = await moveService.getRequestedMovesByDate(moveDate)

      next()
    } catch (error) {
      next(error)
    }
  },
}
