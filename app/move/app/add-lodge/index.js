// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const { protectRoute } = require('../../../../common/middleware/permissions')
const wizard = require('../../../../common/middleware/unique-form-wizard')

const config = require('./config')
const steps = require('./steps')

const { AddLodgeController } = require('./controllers/add-lodge')
const { AddLodgeDateController } = require('./controllers/add-lodge-date')
const { AddLodgeLocationController } = require('./controllers/add-lodge-location')
const { AddLodgeSaveController } = require('./controllers/add-lodge-save')

// Define shared middleware
router.use(protectRoute(['move:create']))

// Define routes
router.use(wizard(steps, null, config, 'params.moveId'))

// Export
module.exports = {
  router,
  AddLodgeController,
  AddLodgeDateController,
  AddLodgeLocationController,
  AddLodgeSaveController,
  mountpath: '/newlodge',
}
