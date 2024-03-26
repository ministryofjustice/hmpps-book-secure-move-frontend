// NPM dependencies
const express = require('express')

const router = express.Router()
const moveRouter = express.Router({ mergeParams: true })
// Local dependencies
const { uuidRegex } = require('../../common/helpers/url')
const { protectRoute } = require('../../common/middleware/permissions')
const { ENABLE_DEVELOPMENT_TOOLS } = require('../../config')
const personEscortRecordApp = require('../person-escort-record')
const policeCustodyFormApp = require('../police-custody-form')
const youthRiskAssessmentApp = require('../youth-risk-assessment')

const assignApp = require('./app/assign')
const cancelApp = require('./app/cancel')
const editApp = require('./app/edit')
const lodgingApp = require('./app/lodging')
const newApp = require('./app/new')
const reviewApp = require('./app/review')
const unassignApp = require('./app/unassign')
const viewApp = require('./app/view')
const { confirmation, journeys } = require('./controllers')
const {
  setMove,
  setPersonEscortRecord,
  setYouthRiskAssessment,
  setAllocation,
  setJourneys,
  setDevelopmentTools,
} = require('./middleware')

router.use(newApp.mountpath, newApp.router)
router.use(viewApp.mountpath, viewApp.router)

router.use(`/:moveId(${uuidRegex})`, moveRouter)

moveRouter.use(setMove)
moveRouter.use(setPersonEscortRecord)
moveRouter.use(setYouthRiskAssessment)

if (ENABLE_DEVELOPMENT_TOOLS) {
  moveRouter.use(setDevelopmentTools)
}

moveRouter.get(
  '/confirmation',
  protectRoute(['move:create', 'move:review']),
  setAllocation,
  confirmation
)
moveRouter.get(
  '/journeys',
  protectRoute('move:view:journeys'),
  setJourneys,
  journeys
)
moveRouter.use(personEscortRecordApp.mountpath, personEscortRecordApp.router)
moveRouter.use(youthRiskAssessmentApp.mountpath, youthRiskAssessmentApp.router)
moveRouter.use(policeCustodyFormApp.mountpath, policeCustodyFormApp.router)
moveRouter.use(reviewApp.mountpath, reviewApp.router)
moveRouter.use(cancelApp.mountpath, cancelApp.router)
moveRouter.use(unassignApp.mountpath, unassignApp.router)
moveRouter.use(assignApp.mountpath, assignApp.router)
moveRouter.use(editApp.mountpath, editApp.router)
moveRouter.use(lodgingApp.mountpath, lodgingApp.router)

// Export
module.exports = {
  router,
  mountpath: '/move',
}
