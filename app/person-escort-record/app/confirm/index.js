// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

const { protectRoute } = require('../../../../common/middleware/permissions')

const config = require('./config')
const fields = require('./fields')
const steps = require('./steps')

// Define shared middleware
router.use(protectRoute('person_escort_record:confirm'))

// Define routes
router.use(wizard(steps, fields, config))

// Export
module.exports = {
  router,
  mountpath: '/confirm',
}
