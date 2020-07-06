// NPM dependencies
const router = require('express').Router()

// Local dependencies
const frameworksService = require('../../common/services/frameworks')

const { setFramework, setPersonEscortRecord } = require('./middleware')
const { defineFormWizards } = require('./router')

const framework = frameworksService.getPersonEscortFramework()

// Define shared middleware
router.use(setFramework(framework))
router.param('personEscortRecordId', setPersonEscortRecord)

// Define routes
defineFormWizards(framework, router)

// Export
module.exports = {
  router,
  mountpath: '/person-escort-record',
}
