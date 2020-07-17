const allocationService = require('../../common/services/allocation')
const moveService = require('../../common/services/move')

module.exports = {
  setMove: async (req, res, next, moveId) => {
    if (!moveId) {
      return next()
    }

    try {
      const move = await moveService.getById(moveId)

      // TODO: Remove `res.locals` in favour of `req.move`. See issue #451
      res.locals.move = move
      req.move = move

      next()
    } catch (error) {
      next(error)
    }
  },

  setPersonEscortRecord: (req, res, next) => {
    const personEscortRecord = req.move?.profile?.person_escort_record

    if (personEscortRecord) {
      req.personEscortRecord = personEscortRecord
    }

    next()
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
