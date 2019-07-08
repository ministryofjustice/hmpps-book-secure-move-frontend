// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { get, ping } = require('./controllers')
const { checkDependencies } = require('./middleware')

// Define routes
router.get('/', checkDependencies, get)
router.get('/ping', checkDependencies, ping)

// Export
module.exports = {
  router,
  skip: true,
  mountpath: '/healthcheck',
}
