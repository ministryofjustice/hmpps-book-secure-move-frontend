// NPM dependencies
const router = require('express').Router({ mergeParams: true })

// Local dependencies
const {
  frameworkOverviewController,
} = require('../../common/controllers/framework')
const { uuidRegex } = require('../../common/helpers/url')
const {
  setFramework,
  setFrameworkSection,
} = require('../../common/middleware/framework')
const { protectRoute } = require('../../common/middleware/permissions')

const confirmApp = require('./app/confirm')
const newApp = require('./app/new')
const { printRecordController } = require('./controllers')
const { setPersonEscortRecord } = require('./middleware')
const { defineFormWizard } = require('./router')

router.param('section', setFrameworkSection)

// Define "create" sub-app before ID sepcific middleware
router.use(newApp.mountpath, newApp.router)

// Define shared middleware
router.use(protectRoute('person_escort_record:view'))
router.use(setPersonEscortRecord)
router.use(setFramework)

// Define sub-apps
router.use(confirmApp.mountpath, confirmApp.router)

// Define routes
router.get('/', frameworkOverviewController)
router.get('/print', printRecordController)
router.use('/:section', defineFormWizard)

// Export
module.exports = {
  router,
  mountpath: `/person-escort-record/:personEscortRecordId(${uuidRegex})?`,
}
