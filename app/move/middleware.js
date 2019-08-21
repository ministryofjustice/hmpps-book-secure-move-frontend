const moveService = require('../../common/services/move')

module.exports = {
  setMove: async (req, res, next, moveId) => {
    if (!moveId) {
      return next()
    }

    try {
      res.locals.move = await moveService.getMoveById(moveId)
      next()
    } catch (error) {
      next(error)
    }
  },
}
