// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const { uuidRegex } = require('../../../../common/helpers/url')
const breadcrumbs = require('../../../../common/middleware/breadcrumbs')
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
const {
  localsActions,
  localsIdentityBar,
  localsMoveDetails,
  localsTabs,
  localsWarnings,
  setBreadcrumb,
} = require('./middleware')

router.get('/', (req, res) => res.redirect(`${req.baseUrl}/warnings`))

// Define shared middleware

// For all non-timeline routes use standard move middleware
router.use(/\/((?!timeline).)*/, setMove)
// For all timeline route use move events middleware
router.use('/timeline', setMoveWithEvents)

router.use(breadcrumbs.setHome())
router.use(setPersonEscortRecord)
router.use(setYouthRiskAssessment)
router.use(setBreadcrumb)
router.use(localsActions)
router.use(localsIdentityBar)
router.use(localsMoveDetails)
router.use(localsTabs)

// Define routes
router.get('/warnings', localsWarnings, renderWarnings)
router.get('/assessments', renderAssessments)
router.get('/timeline', renderTimeline)

// Export
module.exports = {
  router,
  mountpath: `/:moveId(${uuidRegex})/beta`,
}
