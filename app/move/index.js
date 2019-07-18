// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

// Local dependencies
const { protectRoute } = require('../../common/middleware/permissions')
const steps = require('./steps')
const fields = require('./fields')
const { cancel, view, Form } = require('./controllers')
const { setMove } = require('./middleware')

const wizardConfig = {
  controller: Form,
  name: 'new-move',
  journeyName: 'new-move',
  template: 'form-wizard',
}

// Define param middleware
router.param('moveId', setMove)

// Define routes
router.use(
  '/new',
  protectRoute('move:create'),
  wizard(steps, fields, wizardConfig)
)
router.get('/:moveId', protectRoute('move:view'), view)
router
  .route('/:moveId/cancel')
  .get(protectRoute('move:cancel'), cancel.get)
  .post(protectRoute('move:cancel'), cancel.post)

// Export
module.exports = {
  router,
  mountpath: '/move',
}
