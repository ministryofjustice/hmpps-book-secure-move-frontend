// NPM dependencies
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

// Local dependencies
const steps = require('./steps')
const fields = require('./fields')
const { cancelMove, detail, download, list, Form } = require('./controllers')
const { setMove, setMoveDate, setMovesByDateAndLocation } = require('./middleware')
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
router.get('/', setMoveDate, setMovesByDateAndLocation, list)
router.use('/download.:extension(csv|json)', setMoveDate, setMovesByDateAndLocation, download)
router.use('/new', wizard(steps, fields, wizardConfig))
router.get('/:moveId', detail)
router.route('/:moveId/cancel')
  .get(cancelMove.get)
  .post(cancelMove.post)

// Export
module.exports = {
  router,
  mountpath: '/moves',
}
