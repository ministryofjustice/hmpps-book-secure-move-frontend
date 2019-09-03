// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

// Local dependencies
const FormWizardController = require('../../common/controllers/form-wizard')
const { protectRoute } = require('../../common/middleware/permissions')
const { create: createSteps } = require('./steps')
const { create: createFields } = require('./fields')
const { cancel, view, confirmation } = require('./controllers')
const { setMove } = require('./middleware')

const createWizardConfig = {
  controller: FormWizardController,
  name: 'create-move',
  journeyName: 'create-move',
  journeyPageTitle: 'actions::create_move',
  template: 'form-wizard',
}

// Define param middleware
router.param('moveId', setMove)

// Define routes
router.use(
  '/new',
  protectRoute('move:create'),
  wizard(createSteps, createFields, createWizardConfig)
)
router.get('/:moveId', protectRoute('move:view'), view)
router
  .route('/:moveId/cancel')
  .get(protectRoute('move:cancel'), cancel.get)
  .post(protectRoute('move:cancel'), cancel.post)
router.get('/:moveId/confirmation', protectRoute('move:create'), confirmation)

// Export
module.exports = {
  router,
  mountpath: '/move',
}
