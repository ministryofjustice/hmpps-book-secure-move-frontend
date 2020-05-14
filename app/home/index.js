// NPM dependencies
const router = require('express').Router()

// Local dependencies
const {
  setFilterSingleRequests,
  setBodySingleRequests,
} = require('../moves/middleware')

const { dashboard } = require('./controllers')

// Define routes
router.get(
  '/',
  setBodySingleRequests,
  setFilterSingleRequests('/moves/requested'),
  dashboard
)

// Export
module.exports = {
  router,
  mountpath: '/',
}
