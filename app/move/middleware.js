const allocationService = require('../../common/services/allocation')
const moveService = require('../../common/services/move')

module.exports = {
  setMove: async (req, res, next, moveId) => {
    if (!moveId) {
      return next()
    }

    try {
      res.locals.move = await moveService.getById(moveId)
      next()
    } catch (error) {
      next(error)
    }
  },
  setAllocation: async (req, res, next) => {
    const { allocation } = res.locals.move || {}

    if (!allocation) {
      return next()
    }

    try {
      req.allocation = await allocationService.getById(allocation.id)
      next()
    } catch (error) {
      next(error)
    }
  },
}
