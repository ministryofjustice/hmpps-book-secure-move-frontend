// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

// Local dependencies
const steps = require('./steps')
const { get, form } = require('./controllers')
const { setMove } = require('./middleware')
const { ensureAuthenticated } = require('../../common/middleware/authentication')

const fields = {}
const wizardConfig = {
  controller: form,
  name: 'new-move',
  journeyName: 'new-move',
  template: 'form-wizard',
}

// Define param middleware
router.param('moveId', setMove)

// Load router middleware
router.use(ensureAuthenticated)

// Define routes
router.use('/new', wizard(steps, fields, wizardConfig))
router.get('/:moveId', get)

// Export
module.exports = {
  router,
  mountpath: '/moves',
}
