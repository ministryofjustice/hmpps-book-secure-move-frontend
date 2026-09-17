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
  setSectionBreadcrumb,
  setRecord,
} = require('../../common/middleware/framework')
const { protectRoute } = require('../../common/middleware/permissions')
const { setMoveWithEvents } = require('../move/middleware')

const confirmApp = require('./app/confirm')
const newApp = require('./app/new')
const { printRecordController } = require('./controllers')

router.param('section', setFrameworkSection)

// Define "create" sub-app before ID sepcific middleware
router.use(newApp.mountpath, newApp.router)

// Define shared middleware
router.use(protectRoute('person_escort_record:view'))
router.use(setMoveWithEvents)
router.use(setRecord('personEscortRecord', 'personEscortRecord', 'getById'))
router.use(setAssessment('personEscortRecord'))
router.use(breadcrumbs.setHome())
router.use(setBreadcrumbs)

// Define sub-apps
router.use(confirmApp.mountpath, confirmApp.router)

// Define routes
router.get('/', frameworkOverviewController)
router.get('/print', printRecordController)
router.use('/:section', setSectionBreadcrumb, defineFormWizard)

// Export
module.exports = {
  router,
  mountpath: `/person-escort-record/:resourceId(${uuidRegex})?`,
}
