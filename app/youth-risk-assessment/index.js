// NPM dependencies
const router = require('express').Router({ mergeParams: true })

// Local dependencies
const {
  frameworkOverviewController,
} = require('../../common/controllers/framework')
const { uuidRegex } = require('../../common/helpers/url')
const { defineFormWizard } = require('../../common/lib/framework-form-wizard')
const breadcrumbs = require('../../common/middleware/breadcrumbs')
const {
  setAssessment,
  setBreadcrumbs,
  setFrameworkSection,
  setRecord,
  setSectionBreadcrumb,
} = require('../../common/middleware/framework')
const { protectRoute } = require('../../common/middleware/permissions')

const confirmApp = require('./app/confirm')
const newApp = require('./app/new')

router.param('section', setFrameworkSection)

// Define "create" sub-app before ID sepcific middleware
router.use(newApp.mountpath, newApp.router)

// Define shared middleware
router.use(protectRoute('youth_risk_assessment:view'))
// router.use(setPersonEscortRecord)
router.use(setRecord('youthRiskAssessment', 'youthRiskAssessment', 'getById'))
router.use(setAssessment('youthRiskAssessment'))
router.use(breadcrumbs.setHome())
router.use(setBreadcrumbs)

// Define sub-apps
router.use(confirmApp.mountpath, confirmApp.router)

// Define routes
router.get('/', frameworkOverviewController)
router.use('/:section', setSectionBreadcrumb, defineFormWizard)

// Export
module.exports = {
  router,
  mountpath: `/youth-risk-assessment/:resourceId(${uuidRegex})?`,
}
