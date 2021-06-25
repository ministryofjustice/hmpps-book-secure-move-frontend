// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const { uuidRegex } = require('../../../../common/helpers/url')
const {
  setMove,
  setMoveWithEvents,
  setPersonEscortRecord,
  setYouthRiskAssessment,
} = require('../../middleware')

const {
  renderAssessments,
  renderTimeline,
  renderWarnings,
} = require('./controllers')
const { localsActions, localsMoveDetails, localsTabs } = require('./middleware')

router.get('/', (req, res) => res.redirect(`${req.baseUrl}/warnings`))

// Define shared middleware

// For all non-timeline routes use standard move middleware
router.use(/\/((?!timeline).)*/, setMove)
// For all timeline route use move events middleware
router.use('/timeline', setMoveWithEvents)

router.use(setPersonEscortRecord)
router.use(setYouthRiskAssessment)
router.use(localsActions)
router.use(localsMoveDetails)
router.use(localsTabs)

// Define routes
router.get('/warnings', renderWarnings)
router.get('/assessments', renderAssessments)
router.get('/timeline', renderTimeline)

// Export
module.exports = {
  router,
  mountpath: `/:moveId(${uuidRegex})/beta`,
}
