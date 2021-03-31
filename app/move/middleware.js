const populateResources = require('../../common/lib/populate-resources')

module.exports = {
  setMove: async (req, res, next, moveId) => {
    if (!moveId) {
      return next()
    }

    try {
      req.move = await req.services.move.getById(moveId)
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
      const move = await req.services.move.getByIdWithEvents(moveIdWithEvents)
      populateResources(move.timeline_events, req)
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

  setYouthRiskAssessment: (req, res, next) => {
    const youthRiskAssessment = req.move?.profile?.youth_risk_assessment

    if (youthRiskAssessment) {
      req.youthRiskAssessment = youthRiskAssessment
    }

    next()
  },

  setAllocation: async (req, res, next) => {
    const { allocation } = req.move || {}

    if (!allocation) {
      return next()
    }

    try {
      req.allocation = await req.services.allocation.getById(allocation.id)
      next()
    } catch (error) {
      next(error)
    }
  },
}
