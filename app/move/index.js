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

const {
  assignConfig,
  cancelConfig,
  createConfig,
  reviewConfig,
  unassignConfig,
  updateConfig,
} = require('./config')
const {
  confirmation,
  timeline,
  timelineExamples,
  view,
} = require('./controllers')
const {
  assignFields,
  cancelFields,
  createFields,
  reviewFields,
  updateFields,
} = require('./fields')
const {
  setMove,
  setMoveWithEvents,
  setPersonEscortRecord,
  setYouthRiskAssessment,
  setAllocation,
} = require('./middleware')
const {
  assign: assignSteps,
  cancel: cancelSteps,
  create: createSteps,
  review: reviewSteps,
  unassign: unassignSteps,
  update: updateSteps,
} = require('./steps')

// Define param middleware
router.param('moveId', setMove)
router.param('moveIdWithEvents', setMoveWithEvents)

// Define routes
router.use(
  '/new',
  protectRoute('move:create'),
  wizard(createSteps, createFields, createConfig)
)

router.get(
  `/:moveIdWithEvents(${uuidRegex})/timeline`,
  protectRoute('move:view'),
  setPersonEscortRecord,
  setYouthRiskAssessment,
  timeline
)
router.get('/timeline-examples', protectRoute('move:view'), timelineExamples)

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
moveRouter.use(
  '/cancel',
  protectRoute(['move:cancel', 'move:cancel:proposed']),
  wizard(cancelSteps, cancelFields, cancelConfig, 'params.moveId')
)
moveRouter.use(
  '/review',
  wizard(reviewSteps, reviewFields, reviewConfig, 'params.moveId')
)
moveRouter.use(
  '/assign',
  protectRoute('allocation:person:assign'),
  wizard(assignSteps, assignFields, assignConfig, 'params.moveId')
)
moveRouter.use(
  '/unassign',
  protectRoute('allocation:person:assign'),
  wizard(unassignSteps, cancelFields, unassignConfig, 'params.moveId')
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
