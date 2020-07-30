// NPM dependencies
const router = require('express').Router({ mergeParams: true })

// Local dependencies
const { uuidRegex } = require('../../common/helpers/url')
const { protectRoute } = require('../../common/middleware/permissions')
const frameworksService = require('../../common/services/frameworks')

const confirmApp = require('./app/confirm')
const newApp = require('./app/new')
const {
  frameworkOverviewController,
  printRecordController,
} = require('./controllers')
const { setFramework, setPersonEscortRecord } = require('./middleware')
const { defineFormWizards } = require('./router')

const framework = frameworksService.getPersonEscortRecord()
const frameworkWizard = defineFormWizards(framework)

// Define shared middleware
router.use(protectRoute('person_escort_record:view'))
router.use(setFramework(framework))
router.use(setPersonEscortRecord)
router.use(frameworkWizard)

// Define sub-apps
router.use(newApp.mountpath, newApp.router)
router.use(confirmApp.mountpath, confirmApp.router)

// Define routes
router.get('/', frameworkOverviewController)
router.get('/print', printRecordController)

// Export
module.exports = {
  router,
  mountpath: `/person-escort-record/:personEscortRecordId(${uuidRegex})?`,
}
