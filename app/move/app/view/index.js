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

const { PREVIEW_PREFIX } = require('./constants')
const {
  renderAssessments,
  renderDetails,
  renderPersonalDetails,
  renderTimeline,
  renderWarnings,
  renderRequestInformation,
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

// For all non-timeline routes use standard move middleware
router.use(/\/((?!timeline).)*/, setMove)
// For all timeline route use move events middleware
router.use('/timeline', setMoveWithEvents)

router.use(breadcrumbs.setHome())
router.use(setPersonEscortRecord)
router.use(setYouthRiskAssessment)
router.use(setBreadcrumb)
router.use(localsUrls)
router.use(localsActions({ previewPrefix: PREVIEW_PREFIX }))
router.use(localsIdentityBar)
router.use(localsMessageBanner)
router.use(localsMoveDetails)
router.use(localsPersonSummary)
router.use(localsWarnings)
router.use(localsTabs)

// Define routes
router.get('/warnings', renderWarnings)
router.get('/details', renderDetails)
router.get('/assessments', renderAssessments)
router.get('/assessments/personal-details', renderPersonalDetails)
router.get('/assessments/request-information', renderRequestInformation)
router.get('/timeline', renderTimeline)

// Export
module.exports = {
  router,
  mountpath: `${PREVIEW_PREFIX}/:moveId(${uuidRegex})`,
}
