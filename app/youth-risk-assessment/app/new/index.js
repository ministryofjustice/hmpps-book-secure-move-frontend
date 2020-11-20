// NPM dependencies
const router = require('express').Router()

const { protectRoute } = require('../../../../common/middleware/permissions')
const wizard = require('../../../../common/middleware/unique-form-wizard')

const config = require('./config')
const steps = require('./steps')

// Define shared middleware
router.use(protectRoute('youth_risk_assessment:create'))

// Define routes
router.use(wizard(steps, {}, config, 'move.id'))

// Export
module.exports = {
  router,
  mountpath: '/new',
}
