// NPM dependencies
const express = require('express')

// Local dependencies
const auth = require('../../common/middleware/authentication')
const controllers = require('./controllers')

// Initialisation
const router = new express.Router()
const paths = {
  index: '/',
}

// Routing
router.get(paths.index, auth.ensureAuthenticated, controllers.get)

// Export
module.exports = {
  router,
  paths,
}
