// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

const config = require('./config')
const fields = require('./fields')
const steps = require('./steps')

// Define routes
router.use(wizard(steps, fields, config))

// Export
module.exports = {
  router,
  mountpath: '/confirm',
}
