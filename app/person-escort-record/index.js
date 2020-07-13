// NPM dependencies
const router = require('express').Router()

// Local dependencies
const frameworksService = require('../../common/services/frameworks')
const { setMove } = require('../move/middleware')

const newApp = require('./app/new')
const { frameworkOverviewController } = require('./controllers')
const { setFramework, setPersonEscortRecord } = require('./middleware')
const { defineFormWizards } = require('./router')

const framework = frameworksService.getPersonEscortFramework()

// Define shared middleware
router.param('personEscortRecordId', setPersonEscortRecord)
router.param('moveId', setMove)
router.use(setFramework(framework))

// Define sub-apps
router.use(newApp.mountpath, newApp.router)

// Define routes
router.get('/:personEscortRecordId', frameworkOverviewController)
defineFormWizards(framework, router)

// Export
module.exports = {
  router,
  mountpath: '/person-escort-record',
}
