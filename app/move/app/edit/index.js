// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const { protectRoute } = require('../../../../common/middleware/permissions')
const wizard = require('../../../../common/middleware/unique-form-wizard')

const config = require('./config')
const fields = require('./fields')
const steps = require('./steps')

// Define shared middleware

// Define routes
steps.forEach(updateJourney => {
  const { key, steps } = updateJourney
  const updateStepConfig = {
    ...config(),
    name: `update-move-${key}`,
    journeyName: `update-move-${key}`,
  }
  router.use(
    protectRoute(updateJourney.permission, updateJourney),
    wizard(steps, fields, updateStepConfig)
  )
})

// Export
module.exports = {
  router,
  mountpath: '/edit',
}
