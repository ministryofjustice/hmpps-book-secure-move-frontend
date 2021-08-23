// NPM dependencies
const express = require('express')

const router = express.Router()
const moveRouter = express.Router({ mergeParams: true })
// Local dependencies
const { uuidRegex } = require('../../common/helpers/url')
const { protectRoute } = require('../../common/middleware/permissions')
const { ENABLE_DEVELOPMENT_TOOLS, FEATURE_FLAGS } = require('../../config')
const personEscortRecordApp = require('../person-escort-record')
const youthRiskAssessmentApp = require('../youth-risk-assessment')

const assignApp = require('./app/assign')
const cancelApp = require('./app/cancel')
const editApp = require('./app/edit')
const newApp = require('./app/new')
const reviewApp = require('./app/review')
const unassignApp = require('./app/unassign')
const viewApp = require('./app/view')
const {
  confirmation,
  journeys,
  previewOptIn,
  previewOptOut,
  timeline,
  // view,
} = require('./controllers')
const {
  checkPreviewChoice,
  setMove,
  setMoveWithEvents,
  setPersonEscortRecord,
  setYouthRiskAssessment,
  setAllocation,
  setJourneys,
  setDevelopmentTools,
} = require('./middleware')

// Define param middleware

// Define routes
router.use(newApp.mountpath, newApp.router)
router.use(viewApp.mountpath, viewApp.router)
// New view app preview routes
// TODO: Remove these once the new design is being used everywhere
router.get('/preview/opt-in', previewOptIn)
router.get('/preview/opt-out', previewOptOut)

router.use(`/:moveId(${uuidRegex})`, moveRouter)

if (FEATURE_FLAGS.MOVE_PREVIEW) {
  moveRouter.use(checkPreviewChoice({ '/': '/', '/timeline': '/timeline' }))
}

// For all non-timeline routes use standard move middleware
moveRouter.use(/\/((?!timeline).)*/, setMove)
// For all timeline route use move events middleware
moveRouter.use('/timeline', setMoveWithEvents)
moveRouter.use(setPersonEscortRecord)
moveRouter.use(setYouthRiskAssessment)

if (ENABLE_DEVELOPMENT_TOOLS) {
  moveRouter.use(setDevelopmentTools)
}

moveRouter.get('/', protectRoute('move:view'), (req, res) =>
  res.redirect(`/move/preview/${req.move.id}`)
)
moveRouter.get('/timeline', protectRoute('move:view'), timeline)
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
