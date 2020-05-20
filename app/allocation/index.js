const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

const FormWizardController = require('../../common/controllers/form-wizard')
const { protectRoute } = require('../../common/middleware/permissions')

const confirmation = require('./controllers/create/confirmation')
const personAssign = require('./controllers/person-assign')
const view = require('./controllers/view')
const { cancelFields, createFields, personAssignFields } = require('./fields')
const { setAllocation } = require('./middleware')
const {
  cancelSteps,
  createSteps,
  personAssignSteps,
  unassignSteps,
} = require('./steps')

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

const personAsssignConfig = {
  ...wizardConfig,
  controller: personAssign.Base,
  name: 'allocation:person:assign',
  templatePath: 'move/views/create/',
  template: '../../../form-wizard',
  journeyName: 'allocation:person:assign',
  journeyPageTitle: 'allocation::person:assign',
}

router.use(
  '/new',
  protectRoute('allocation:create'),
  wizard(createSteps, createFields, createConfig)
)

router.use(
  '/:allocationId/assign',
  protectRoute('allocation:person:assign'),
  wizard(personAssignSteps, personAssignFields, personAsssignConfig)
)
router.get(
  '/:allocationId/confirmation',
  protectRoute('allocation:create'),
  confirmation
)
router.get('/:allocationId', protectRoute('allocations:view'), view)
const cancelConfig = {
  ...wizardConfig,
  controller: FormWizardController,
  name: 'cancel-an-allocation',
  templatePath: 'allocation/views/cancel/',
  template: '../../../form-wizard',
  journeyName: 'cancel-an-allocation',
  journeyPageTitle: 'actions::cancel_allocation',
}
router.use(
  '/:allocationId/cancel',
  protectRoute('allocation:cancel'),
  wizard(cancelSteps, cancelFields, cancelConfig)
)

const unassignConfig = {
  ...wizardConfig,
  controller: FormWizardController,
  name: 'unassign-an-allocation',
  templatePath: 'allocation/views/person-assign/',
  template: '../../../form-wizard',
  journeyName: 'unassign-an-allocation',
  journeyPageTitle: 'actions::cancel_allocation',
}
router.use(
  '/:allocationId/unassign/:moveId/:personId',
  protectRoute('allocation:person:assign'),
  (req, res, next) => {
    req.moveId = req.params.moveId
    req.personId = req.params.personId
    next()
  },
  wizard(unassignSteps, cancelFields, unassignConfig)
)
// Export
module.exports = {
  router,
  mountpath: '/allocation',
}
