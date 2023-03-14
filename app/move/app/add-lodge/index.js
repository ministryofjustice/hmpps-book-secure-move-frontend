// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const { protectRoute } = require('../../../../common/middleware/permissions')
const wizard = require('../../../../common/middleware/unique-form-wizard')


const config = require('./config')
const steps = require('./steps')
const fields = require('./fields')


// Define shared middleware
router.use(protectRoute(['move:create']))

// Define routes
router.use(wizard(steps, fields, config, 'params.moveId'))

// Export
module.exports = {
  router,
  mountpath: '/newlodge',
}
