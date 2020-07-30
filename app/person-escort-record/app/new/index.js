// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

const { protectRoute } = require('../../../../common/middleware/permissions')

const config = require('./config')
const steps = require('./steps')

// Define shared middleware
router.use(protectRoute('person_escort_record:create'))

// Define routes
router.use(wizard(steps, {}, config))

// Export
module.exports = {
  router,
  mountpath: '/new',
}
