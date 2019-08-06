// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { mountpath: movesUrl } = require('../moves')

// Define routes
router.get('/', (req, res) => res.redirect(movesUrl))

// Export
module.exports = {
  router,
  mountpath: '/',
}
