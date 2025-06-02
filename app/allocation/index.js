const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')

const { protectRoute } = require('../../common/middleware/permissions')
const wizard = require('../../common/middleware/unique-form-wizard')
const { setMove } = require('../move/middleware')

const editRouter = require('./app/edit').default
const { cancelConfig, removeMoveConfig, createConfig } = require('./config')
const {
  createControllers,
  viewAllocation,
  assignToAllocation,
} = require('./controllers')
const { cancelFields, createFields } = require('./fields')
const { setAllocation } = require('./middleware')
const { cancelSteps, removeMoveSteps, createSteps } = require('./steps')

router.param('allocationId', setAllocation)
router.param('moveId', setMove)

router.get('/new', (req, res) => res.redirect(`${req.baseUrl}/new/${uuidv4()}`))
router.use(
  `/new/:id`,
  protectRoute('allocation:create'),
  wizard(createSteps, createFields, createConfig, 'params.id')
)

router.use('/:allocationId/edit', protectRoute('allocation:update'), editRouter)

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
router.get('/:allocationId/assign', assignToAllocation)

// Export
module.exports = {
  router,
  mountpath: '/allocation',
}
