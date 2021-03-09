// NPM dependencies
const express = require('express')
const router = express.Router()
const moveRouter = express.Router({ mergeParams: true })

// Local dependencies
const { uuidRegex } = require('../../common/helpers/url')
const { protectRoute } = require('../../common/middleware/permissions')
const personEscortRecordApp = require('../person-escort-record')
const youthRiskAssessmentApp = require('../youth-risk-assessment')

const assignApp = require('./app/assign')
const cancelApp = require('./app/cancel')
const editApp = require('./app/edit')
const newApp = require('./app/new')
const reviewApp = require('./app/review')
const unassignApp = require('./app/unassign')
const { confirmation, timeline, view } = require('./controllers')
const {
  setMove,
  setMoveWithEvents,
  setPersonEscortRecord,
  setYouthRiskAssessment,
  setAllocation,
} = require('./middleware')

// Define param middleware
router.param('moveId', setMove)
router.param('moveIdWithEvents', setMoveWithEvents)

// Define routes
router.use(newApp.mountpath, newApp.router)

router.get(
  `/:moveIdWithEvents(${uuidRegex})/timeline`,
  protectRoute('move:view'),
  setPersonEscortRecord,
  setYouthRiskAssessment,
  timeline
)

router.use(
  `/:moveId(${uuidRegex})`,
  setPersonEscortRecord,
  setYouthRiskAssessment,
  moveRouter
)

moveRouter.get('/', protectRoute('move:view'), view)

moveRouter.get(
  '/confirmation',
  protectRoute(['move:create', 'move:review']),
  setAllocation,
  confirmation
)
moveRouter.use(personEscortRecordApp.mountpath, personEscortRecordApp.router)
moveRouter.use(youthRiskAssessmentApp.mountpath, youthRiskAssessmentApp.router)
moveRouter.use(reviewApp.mountpath, reviewApp.router)
moveRouter.use(cancelApp.mountpath, cancelApp.router)
moveRouter.use(unassignApp.mountpath, unassignApp.router)
moveRouter.use(assignApp.mountpath, assignApp.router)
moveRouter.use(editApp.mountpath, editApp.router)

// Export
module.exports = {
  router,
  mountpath: '/move',
}
