// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const { protectRoute } = require('../../../../common/middleware/permissions')
const wizard = require('../../../../common/middleware/unique-form-wizard')

const config = require('./config')
const steps = require('./steps')

// Define shared middleware
router.use(protectRoute('allocation:person:assign'))

// Define routes
router.use(wizard(steps, {}, config, 'params.moveId'))

// Export
module.exports = {
  router,
  mountpath: '/unassign',
}
