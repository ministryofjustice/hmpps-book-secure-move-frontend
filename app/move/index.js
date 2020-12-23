// NPM dependencies
const express = require('express')
const router = express.Router()
const moveRouter = express.Router({ mergeParams: true })

// Local dependencies
const { uuidRegex } = require('../../common/helpers/url')
const { protectRoute } = require('../../common/middleware/permissions')
const wizard = require('../../common/middleware/unique-form-wizard')
const personEscortRecordApp = require('../person-escort-record')
const youthRiskAssessmentApp = require('../youth-risk-assessment')

const cancelApp = require('./app/cancel')
const newApp = require('./app/new')
const reviewApp = require('./app/review')
const { assignConfig, unassignConfig, updateConfig } = require('./config')
const { confirmation, timeline, view } = require('./controllers')
const { assignFields, updateFields } = require('./fields')
const {
  setMove,
  setMoveWithEvents,
  setPersonEscortRecord,
  setYouthRiskAssessment,
  setAllocation,
} = require('./middleware')
const {
  assign: assignSteps,
  unassign: unassignSteps,
  update: updateSteps,
} = require('./steps')

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
moveRouter.use(
  '/assign',
  protectRoute('allocation:person:assign'),
  wizard(assignSteps, assignFields, assignConfig, 'params.moveId')
)
moveRouter.use(
  '/unassign',
  protectRoute('allocation:person:assign'),
  wizard(unassignSteps, {}, unassignConfig, 'params.moveId')
)

updateSteps.forEach(updateJourney => {
  const { key, steps } = updateJourney
  const updateStepConfig = {
    ...updateConfig(),
    name: `update-move-${key}`,
    journeyName: `update-move-${key}`,
  }
  moveRouter.use(
    '/edit',
    protectRoute(updateJourney.permission),
    wizard(steps, updateFields, updateStepConfig)
  )
})

// Export
module.exports = {
  router,
  mountpath: '/move',
}
