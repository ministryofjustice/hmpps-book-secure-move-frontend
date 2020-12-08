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

const confirmApp = require('./app/confirm')
const newApp = require('./app/new')
const { printRecordController } = require('./controllers')

router.param('section', setFrameworkSection)

// Define "create" sub-app before ID sepcific middleware
router.use(newApp.mountpath, newApp.router)

// Define shared middleware
router.use(protectRoute('person_escort_record:view'))
router.use(setRecord('personEscortRecord', 'personEscortRecord'))
router.use(setAssessment('personEscortRecord'))

// Define sub-apps
router.use(confirmApp.mountpath, confirmApp.router)

// Define routes
router.get('/', frameworkOverviewController)
router.get('/print', printRecordController)
router.use('/:section', defineFormWizard)

// Export
module.exports = {
  router,
  mountpath: `/person-escort-record/:resourceId(${uuidRegex})?`,
}
