const router = require('express').Router()

const { protectRoute } = require('../../common/middleware/permissions')
const wizard = require('../../common/middleware/unique-form-wizard')
const { setMove } = require('../move/middleware')

const { cancelConfig, removeMoveConfig, createConfig } = require('./config')
const { createControllers, viewAllocation } = require('./controllers')
const { cancelFields, createFields } = require('./fields')
const { setAllocation } = require('./middleware')
const { cancelSteps, removeMoveSteps, createSteps } = require('./steps')

router.param('allocationId', setAllocation)
router.param('moveId', setMove)

router.use(
  '/new',
  protectRoute('allocation:create'),
  wizard(createSteps, createFields, createConfig)
)

router.get(
  '/:allocationId/confirmation',
  protectRoute('allocation:create'),
  createControllers.ConfirmationController
)

router.use(
  '/:allocationId/:moveId/remove',
  protectRoute('allocation:cancel'),
  wizard(removeMoveSteps, {}, removeMoveConfig, 'params.allocationId')
)

router.use(
  '/:allocationId/cancel',
  protectRoute('allocation:cancel'),
  wizard(cancelSteps, cancelFields, cancelConfig, 'params.allocationId')
)

router.get('/:allocationId', protectRoute('allocations:view'), viewAllocation)

// Export
module.exports = {
  router,
  mountpath: '/allocation',
}
