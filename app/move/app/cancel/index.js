// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const { protectRoute } = require('../../../../common/middleware/permissions')
const wizard = require('../../../../common/middleware/unique-form-wizard')

const config = require('./config')
const fields = require('./fields')
const steps = require('./steps')

// Define shared middleware
router.use(protectRoute(['move:cancel', 'move:cancel:proposed']))

// Define routes
router.use(wizard(steps, fields, config, 'params.moveId'))

// Export
module.exports = {
  router,
  mountpath: '/cancel',
}
