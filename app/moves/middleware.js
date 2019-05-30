const api = require('../../common/lib/api-client')

module.exports = {
  setMove: async (req, res, next, moveId) => {
    if (!moveId) {
      return next()
    }

    try {
      const move = await api.getMoveById(moveId)

      res.locals.move = move.data

      next()
    } catch (error) {
      next(error)
    }
  },
}
