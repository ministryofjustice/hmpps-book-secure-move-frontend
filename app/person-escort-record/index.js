// NPM dependencies
const router = require('express').Router()

// Local dependencies
const frameworksService = require('../../common/services/frameworks')

const { defineFormWizards } = require('./router')

// Define routes
const framework = frameworksService.getPersonEscortFramework()
defineFormWizards(framework, router)

// Export
module.exports = {
  router,
  mountpath: '/person-escort-record',
}
