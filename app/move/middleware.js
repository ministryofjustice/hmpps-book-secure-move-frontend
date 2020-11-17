const populateResources = require('../../common/lib/populate-resources')
const allocationService = require('../../common/services/allocation')
const moveService = require('../../common/services/move')

module.exports = {
  setMove: async (req, res, next, moveId) => {
    if (!moveId) {
      return next()
    }

    try {
      req.move = await moveService.getById(moveId)
      next()
    } catch (error) {
      next(error)
    }
  },

  setMoveWithEvents: async (req, res, next, moveIdWithEvents) => {
    if (!moveIdWithEvents) {
      return next()
    }

    try {
      const move = await moveService.getByIdWithEvents(moveIdWithEvents)
      await populateResources(move.timeline_events)
      req.move = move
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
