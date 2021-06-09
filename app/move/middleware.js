const {
  mountpath: toolsMountpath,
  routes: toolsRoutes,
} = require('../../app/tools')
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

  setJourneys: async (req, res, next) => {
    if (!req.move) {
      return next()
    }

    try {
      req.journeys = await req.services.journey.getByMoveId(req.move.id)
      next()
    } catch (error) {
      next(error)
    }
  },

  setDevelopmentTools: (req, res, next) => {
    if (!res.locals.DEVELOPMENT_TOOLS) {
      return next()
    }

    if (!req.move) {
      return next()
    }

    const items = res.locals.DEVELOPMENT_TOOLS.items || []

    res.locals.DEVELOPMENT_TOOLS.items = [
      ...items,
      {
        text: 'Move:',
      },
      {
        href: `${toolsMountpath}${toolsRoutes.moveChangeStatus}/${req.move.id}/${req.move.status}`,
        text: 'Progress status',
      },
    ]

    const {
      person_escort_record: personEscortRecord,
      youth_risk_assessment: youthRiskAssessment,
    } = req.move.profile || {}

    if (personEscortRecord && personEscortRecord.status !== 'confirmed') {
      res.locals.DEVELOPMENT_TOOLS.items.push({
        href: `${toolsMountpath}${toolsRoutes.completeAssessment}/person-escort-record/${personEscortRecord.id}`,
        text: 'Complete Person Escort Record',
      })
    }

    if (youthRiskAssessment && youthRiskAssessment.status !== 'confirmed') {
      res.locals.DEVELOPMENT_TOOLS.items.push({
        href: `${toolsMountpath}${toolsRoutes.completeAssessment}/youth-risk-assessment/${youthRiskAssessment.id}`,
        text: 'Complete Youth Risk Assessment',
      })
    }

    next()
  },
}
