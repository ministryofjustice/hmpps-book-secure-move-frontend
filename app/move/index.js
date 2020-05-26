// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

// Local dependencies
const FormWizardController = require('../../common/controllers/form-wizard')
const { protectRoute } = require('../../common/middleware/permissions')
const { FEATURE_FLAGS } = require('../../config')

const { assign, confirmation, create, update, view } = require('./controllers')
const {
  assignFields,
  cancelFields,
  createFields,
  reviewFields,
  updateFields,
} = require('./fields')
const { setMove } = require('./middleware')
const {
  assign: assignSteps,
  cancel: cancelSteps,
  create: createSteps,
  review: reviewSteps,
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
const reviewConfig = {
  ...wizardConfig,
  name: 'review-move',
  journeyName: 'review-move',
}
const assignConfig = {
  ...wizardConfig,
  controller: assign.Base,
  name: 'allocation:person:assign',
  templatePath: 'move/views/create/',
  template: '../../../form-wizard',
  journeyName: 'allocation:person:assign',
  journeyPageTitle: 'allocation::person:assign',
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
router.get(
  '/:moveId/confirmation',
  protectRoute(['move:create', 'move:review']),
  confirmation
)
router.use(
  '/:moveId/cancel',
  protectRoute('move:cancel'),
  wizard(cancelSteps, cancelFields, cancelConfig)
)
router.use('/:moveId/review', wizard(reviewSteps, reviewFields, reviewConfig))
router.use(
  '/:moveId/assign',
  protectRoute('allocation:person:assign'),
  wizard(assignSteps, assignFields, assignConfig)
)

if (FEATURE_FLAGS.EDITABILITY) {
  updateSteps.forEach(updateJourney => {
    const { key, steps } = updateJourney
    const updateStepConfig = {
      ...updateConfig,
      name: `update-move-${key}`,
      journeyName: `update-move-${key}`,
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
