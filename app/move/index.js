// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

// Local dependencies
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
router.use('/new', wizard(steps, fields, wizardConfig))
router.get('/:moveId', view)
router
  .route('/:moveId/cancel')
  .get(cancel.get)
  .post(cancel.post)

// Export
module.exports = {
  router,
  mountpath: '/move',
}
