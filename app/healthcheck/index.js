// NPM dependencies
const express = require('express')

// Local dependencies
const { get, ping, health, info } = require('./controllers')
const { checkDependencies } = require('./middleware')

// Define routes
const router = express.Router()
router.get('/', checkDependencies, get)
router.get('/ping', ping)

// HMPPS standard endpoints, mounted at the root of the app
const standardRouter = express.Router()
standardRouter.get('/health', checkDependencies, health)
standardRouter.get('/info', info)

// Export
module.exports = {
  router,
  standardRouter,
  skip: true,
  mountpath: '/healthcheck',
}
