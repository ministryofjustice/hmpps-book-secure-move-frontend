// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

// Local dependencies
const FormWizardController = require('../../common/controllers/form-wizard')
const { protectRoute } = require('../../common/middleware/permissions')
const { cancel: cancelSteps, create: createSteps } = require('./steps')
const { cancel: cancelFields, create: createFields } = require('./fields')
const { confirmation, create, view } = require('./controllers')
const { setMove } = require('./middleware')

const wizardConfig = {
  controller: FormWizardController,
  template: 'form-wizard',
}
const createConfig = {
  ...wizardConfig,
  controller: create.Base,
  name: 'create-move',
  journeyName: 'create-move',
  journeyPageTitle: 'actions::create_move',
}
const cancelConfig = {
  ...wizardConfig,
  name: 'cancel-move',
  journeyName: 'cancel-move',
}

// Define param middleware
router.param('moveId', setMove)

// Define routes
router.use(
  '/new',
  protectRoute('move:create'),
  wizard(createSteps, createFields, createConfig)
)
router.get('/:moveId', protectRoute('move:view'), view)
router.get('/:moveId/confirmation', protectRoute('move:create'), confirmation)
router.use(
  '/:moveId/cancel',
  protectRoute('move:cancel'),
  wizard(cancelSteps, cancelFields, cancelConfig)
)

// Export
module.exports = {
  router,
  mountpath: '/move',
}
