// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const { uuidRegex } = require('../../../../common/helpers/url')
const breadcrumbs = require('../../../../common/middleware/breadcrumbs')
const {
  setMoveWithEvents,
  setPersonEscortRecord,
  setYouthRiskAssessment,
  setJourneys,
} = require('../../middleware')

const {
  renderDetails,
  renderTimeline,
  renderWarnings,
} = require('./controllers')
const {
  localsActions,
  localsIdentityBar,
  localsMessageBanner,
  localsMoveDetails,
  localsPersonSummary,
  localsTabs,
  localsUrls,
  localsWarnings,
  setBreadcrumb,
} = require('./middleware')

router.get('/', (req, res) => res.redirect(`${req.baseUrl}/warnings`))

// Define shared middleware

router.use(breadcrumbs.setHome())
router.use(setMoveWithEvents)
router.use(setPersonEscortRecord)
router.use(setYouthRiskAssessment)
router.use(setJourneys)
router.use(setBreadcrumb)
router.use(localsUrls)
router.use(localsActions)
router.use(localsIdentityBar)
router.use(localsMessageBanner)
router.use(localsMoveDetails)
router.use(localsPersonSummary)
router.use(localsTabs)

// Define routes
router.get('/warnings', localsWarnings, renderWarnings)
router.get('/details', renderDetails)
router.get('/timeline', renderTimeline)

// Export
module.exports = {
  router,
  mountpath: `/:moveId(${uuidRegex})`,
}
