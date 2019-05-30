// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { get } = require('./controllers')
const { setMove } = require('./middleware')
const { ensureAuthenticated } = require('../../common/middleware/authentication')

// Define param middleware
router.param('moveId', setMove)

// Load router middleware
router.use(ensureAuthenticated)

// Define routes
router.get('/:moveId', get)

// Export
module.exports = {
  router,
  mountpath: '/moves',
}
