// NPM dependencies
const router = require('express').Router({ mergeParams: true })

// Local dependencies
const { uuidRegex } = require('../../common/helpers/url')
const frameworksService = require('../../common/services/frameworks')

const newApp = require('./app/new')
const { frameworkOverviewController } = require('./controllers')
const { setFramework, setPersonEscortRecord } = require('./middleware')
const { defineFormWizards } = require('./router')

const framework = frameworksService.getPersonEscortFramework()
const frameworkWizard = defineFormWizards(framework)

// Define shared middleware
router.use(setFramework(framework))
router.use(setPersonEscortRecord)
router.use(frameworkWizard)

// Define sub-apps
router.use(newApp.mountpath, newApp.router)

// Define routes
router.get('/', frameworkOverviewController)

// Export
module.exports = {
  router,
  mountpath: `/person-escort-record/:personEscortRecordId(${uuidRegex})?`,
}
