// NPM dependencies
const express = require('express')
const router = express.Router()
const moveRouter = express.Router()
const wizard = require('hmpo-form-wizard')

// Local dependencies
const FormWizardController = require('../../common/controllers/form-wizard')
const { uuidRegex } = require('../../common/helpers/url')
const { protectRoute } = require('../../common/middleware/permissions')
const personEscortRecordApp = require('../person-escort-record')
const { setFramework } = require('../person-escort-record/middleware')

const {
  assign,
  confirmation,
  create,
  update,
  timeline,
  view,
} = require('./controllers')
const {
  assignFields,
  cancelFields,
  createFields,
  reviewFields,
  updateFields,
} = require('./fields')
const {
  setMove,
  setPersonEscortRecord,
  setAllocation,
} = require('./middleware')
const {
  assign: assignSteps,
  cancel: cancelSteps,
  create: createSteps,
  review: reviewSteps,
  unassign: unassignSteps,
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
const unassignConfig = {
  ...wizardConfig,
  controller: FormWizardController,
  name: 'unassign-an-allocation',
  templatePath: 'move/views/',
  template: '../../../form-wizard',
  journeyName: 'unassign-an-allocation',
  journeyPageTitle: 'actions::cancel_allocation',
}

router.get(`/:id(${uuidRegex})/timeline`, protectRoute('move:view'), timeline)

// Define param middleware
router.param('moveId', setMove)

// Define routes
router.use(
  '/new',
  protectRoute('move:create'),
  wizard(createSteps, createFields, createConfig)
)
router.use(
  `/:moveId(${uuidRegex})`,
  setPersonEscortRecord,
  setFramework,
  moveRouter
)

moveRouter.get('/', protectRoute('move:view'), view)

moveRouter.get(
  '/confirmation',
  protectRoute(['move:create', 'move:review']),
  setAllocation,
  confirmation
)
moveRouter.use(personEscortRecordApp.mountpath, personEscortRecordApp.router)
moveRouter.use(
  '/cancel',
  protectRoute(['move:cancel', 'move:cancel:proposed']),
  wizard(cancelSteps, cancelFields, cancelConfig)
)
moveRouter.use('/review', wizard(reviewSteps, reviewFields, reviewConfig))
moveRouter.use(
  '/assign',
  protectRoute('allocation:person:assign'),
  wizard(assignSteps, assignFields, assignConfig)
)
moveRouter.use(
  '/unassign',
  protectRoute('allocation:person:assign'),
  wizard(unassignSteps, cancelFields, unassignConfig)
)

updateSteps.forEach(updateJourney => {
  const { key, steps } = updateJourney
  const updateStepConfig = {
    ...updateConfig,
    name: `update-move-${key}`,
    journeyName: `update-move-${key}`,
  }
  moveRouter.use(
    '/edit',
    protectRoute(updateJourney.permission),
    wizard(steps, updateFields, updateStepConfig)
  )
})

// Export
module.exports = {
  router,
  mountpath: '/move',
}
