// NPM dependencies
const router = require('express').Router()

const { protectRoute } = require('../../../../common/middleware/permissions')
const wizard = require('../../../../common/middleware/unique-form-wizard')
const fields = require('../../fields')

const config = require('./config')
const steps = require('./steps')

// Define shared middleware
router.use(protectRoute('move:create'))

// Define routes
router.use(wizard(steps, fields.createFields, config))

// Export
module.exports = {
  router,
  mountpath: '/new',
}
