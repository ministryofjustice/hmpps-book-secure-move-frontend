// NPM dependencies
const express = require('express')

// Local dependencies
const { get } = require('./controllers')
const { setMove } = require('./middleware')

// Initialisation
const router = new express.Router()
const paths = {
  index: '/moves/:moveId',
}

// Routing
router.param('moveId', setMove)
router.get(paths.index, get)

// Export
module.exports = {
  router,
  paths,
}
