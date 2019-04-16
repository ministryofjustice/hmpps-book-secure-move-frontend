// NPM dependencies
const express = require('express')

// Local dependencies
const getController = require('./get.controller')

// Initialisation
const router = new express.Router()
const paths = {
  index: '/',
}

// Routing
router.get(paths.index, getController)

// Export
module.exports = {
  router,
  paths,
}
