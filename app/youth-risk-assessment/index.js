// NPM dependencies
const router = require('express').Router({ mergeParams: true })

// Local dependencies
const {
  frameworkOverviewController,
} = require('../../common/controllers/framework')
const { uuidRegex } = require('../../common/helpers/url')
const { defineFormWizard } = require('../../common/lib/framework-form-wizard')
const {
  setAssessment,
  setFrameworkSection,
  setRecord,
} = require('../../common/middleware/framework')
const { protectRoute } = require('../../common/middleware/permissions')
const youthRiskAssessmentService = require('../../common/services/youth-risk-assessment')

const confirmApp = require('./app/confirm')
const newApp = require('./app/new')

router.param('section', setFrameworkSection)

// Define "create" sub-app before ID sepcific middleware
router.use(newApp.mountpath, newApp.router)

// Define shared middleware
router.use(protectRoute('youth_risk_assessment:view'))
// router.use(setPersonEscortRecord)
router.use(setRecord('youthRiskAssessment', youthRiskAssessmentService.getById))
router.use(setAssessment('youthRiskAssessment'))

// Define sub-apps
router.use(confirmApp.mountpath, confirmApp.router)

// Define routes
router.get('/', frameworkOverviewController)
router.use('/:section', defineFormWizard)

// Export
module.exports = {
  router,
  mountpath: `/youth-risk-assessment/:resourceId(${uuidRegex})?`,
}
