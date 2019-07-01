// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

// Local dependencies
const steps = require('./steps')
const fields = require('./fields')
const { detail, list, Form } = require('./controllers')
const { setMove, setMoveDate, setMovesByDate } = require('./middleware')
const { ensureAuthenticated } = require('../../common/middleware/authentication')

const wizardConfig = {
  controller: Form,
  name: 'new-move',
  journeyName: 'new-move',
  template: 'form-wizard',
}

// Define param middleware
router.param('moveId', setMove)

// Load router middleware
router.use(ensureAuthenticated)

// Define routes
router.get('/', setMoveDate, setMovesByDate, list)
router.use('/new', wizard(steps, fields, wizardConfig))
router.get('/:moveId', detail)

// Export
module.exports = {
  router,
  mountpath: '/moves',
}
