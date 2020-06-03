const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

const FormWizardController = require('../../common/controllers/form-wizard')
const { protectRoute } = require('../../common/middleware/permissions')

const confirmation = require('./controllers/create/confirmation')
const view = require('./controllers/view')
const { cancelFields, createFields } = require('./fields')
const { setAllocation } = require('./middleware')
const { cancelSteps, createSteps } = require('./steps')

const wizardConfig = {
  controller: FormWizardController,
  template: 'form-wizard',
}
const createConfig = {
  ...wizardConfig,
  controller: FormWizardController,
  journeyName: 'create-an-allocation',
  journeyPageTitle: 'actions::create_allocation',
  name: 'create-an-allocation',
  template: '../../../form-wizard',
  templatePath: 'allocation/views/create/',
}
const cancelConfig = {
  ...wizardConfig,
  controller: FormWizardController,
  journeyName: 'cancel-an-allocation',
  journeyPageTitle: 'actions::cancel_allocation',
  name: 'cancel-an-allocation',
  template: '../../../form-wizard',
  templatePath: 'allocation/views/cancel/',
}

router.param('allocationId', setAllocation)

router.use(
  '/new',
  protectRoute('allocation:create'),
  wizard(createSteps, createFields, createConfig)
)

router.get(
  '/:allocationId/confirmation',
  protectRoute('allocation:create'),
  confirmation
)

router.use(
  '/:allocationId/cancel',
  protectRoute('allocation:cancel'),
  wizard(cancelSteps, cancelFields, cancelConfig)
)

router.get('/:allocationId', protectRoute('allocations:view'), view)

// Export
module.exports = {
  mountpath: '/allocation',
  router,
}
