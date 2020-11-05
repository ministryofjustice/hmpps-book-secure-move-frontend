const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

const FormWizardController = require('../../common/controllers/form-wizard')
const { protectRoute } = require('../../common/middleware/permissions')
const { setMove } = require('../move/middleware')

const { createControllers, viewAllocation } = require('./controllers')
const { cancelFields, createFields } = require('./fields')
const { setAllocation } = require('./middleware')
const { cancelSteps, removeMoveSteps, createSteps } = require('./steps')

const wizardConfig = {
  controller: FormWizardController,
  template: 'form-wizard',
}
const createConfig = {
  ...wizardConfig,
  controller: FormWizardController,
  name: 'create-an-allocation',
  templatePath: 'allocation/views/create/',
  template: '../../../form-wizard',
  journeyName: 'create-an-allocation',
  journeyPageTitle: 'actions::create_allocation',
}
const cancelConfig = {
  ...wizardConfig,
  controller: FormWizardController,
  name: 'cancel-an-allocation',
  templatePath: 'allocation/views/',
  template: '../../../form-wizard',
  journeyName: 'cancel-an-allocation',
  journeyPageTitle: 'actions::cancel_allocation',
}
const removeMoveConfig = {
  ...wizardConfig,
  controller: FormWizardController,
  name: 'remove-a-move-from-an-allocation',
  templatePath: 'allocation/views/cancel/',
  template: '../../../form-wizard',
  journeyName: 'remove-a-move-from-an-allocation',
  journeyPageTitle: 'actions::cancel_move',
}

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
  wizard(removeMoveSteps, {}, removeMoveConfig)
)

router.use(
  '/:allocationId/cancel',
  protectRoute('allocation:cancel'),
  wizard(cancelSteps, cancelFields, cancelConfig)
)

router.get('/:allocationId', protectRoute('allocations:view'), viewAllocation)

// Export
module.exports = {
  router,
  mountpath: '/allocation',
}
