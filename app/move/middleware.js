const allocationService = require('../../common/services/allocation')

module.exports = {
  setMove: async (req, res, next, moveId) => {
    if (!moveId) {
      return next()
    }

    try {
      const moveService = req.services.move()
      req.move = await moveService.getById(moveId)
      next()
    } catch (error) {
      next(error)
    }
  },

  setPersonEscortRecord: (req, res, next) => {
    const personEscortRecord = req.move?.profile?.person_escort_record

    if (personEscortRecord) {
      const isEditable =
        ['requested', 'booked'].includes(req.move?.status) &&
        !['confirmed'].includes(personEscortRecord.status)

      req.personEscortRecord = {
        ...personEscortRecord,
        isEditable,
      }
    }

    next()
  },

  setAllocation: async (req, res, next) => {
    const { allocation } = req.move || {}

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
