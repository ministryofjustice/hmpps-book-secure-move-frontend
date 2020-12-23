// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const wizard = require('../../../../common/middleware/unique-form-wizard')

const config = require('./config')
const fields = require('./fields')
const steps = require('./steps')

// Define shared middleware

// Define routes
router.use(wizard(steps, fields, config, 'params.moveId'))

// Export
module.exports = {
  router,
  mountpath: '/review',
}
