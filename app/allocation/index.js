const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

const FormWizardController = require('../../common/controllers/form-wizard')
const { protectRoute } = require('../../common/middleware/permissions')

const confirmation = require('./controllers/create/confirmation')
const view = require('./controllers/view')
const { createFields } = require('./fields')
const { setAllocation } = require('./middleware')
const { createSteps } = require('./steps')

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
router.get('/:allocationId', protectRoute('allocations:view'), view)
// Export
module.exports = {
  router,
  mountpath: '/allocation',
}
