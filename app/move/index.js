// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

// Local dependencies
const FormWizardController = require('../../common/controllers/form-wizard')
const { protectRoute } = require('../../common/middleware/permissions')
const { FEATURE_FLAGS } = require('../../config')

const { confirmation, create, update, view } = require('./controllers')
const {
  cancel: cancelFields,
  create: createFields,
  update: updateFields,
} = require('./fields')
const { setMove } = require('./middleware')
const {
  cancel: cancelSteps,
  create: createSteps,
  update: updateSteps,
} = require('./steps')

const wizardConfig = {
  controller: FormWizardController,
  template: 'form-wizard',
}
const createConfig = {
  ...wizardConfig,
  controller: create.Base,
  name: 'create-a-move',
  templatePath: 'move/views/create/',
  template: '../../../form-wizard',
  journeyName: 'create-a-move',
  journeyPageTitle: 'actions::create_move',
}
const updateConfig = {
  ...wizardConfig,
  controller: update.Base,
  templatePath: 'move/views/create/',
  template: '../../../form-wizard',
  journeyPageTitle: 'actions::update_move',
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

if (FEATURE_FLAGS.EDITABILITY) {
  updateSteps.forEach(updateJourney => {
    const steps = updateJourney.steps
    const key = Object.keys(steps)[0]
    const updateStepConfig = {
      ...updateConfig,
      name: 'update-a-move' + key,
      journeyName: 'update-a-move' + key,
    }
    router.use(
      '/:moveId/edit',
      protectRoute(updateJourney.permission),
      wizard(steps, updateFields, updateStepConfig)
    )
  })
}

// Export
module.exports = {
  router,
  mountpath: '/move',
}
