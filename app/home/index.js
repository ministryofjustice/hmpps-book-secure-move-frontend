// NPM dependencies
const router = require('express').Router()

// Local dependencies
const {
  setFilterSingleRequests,
  setBodySingleRequests,
} = require('../moves/middleware')

const { dashboard } = require('./controllers')
const { overrideBodySingleRequests } = require('./middleware')

// Define routes
router.get(
  '/',
  setBodySingleRequests,
  overrideBodySingleRequests,
  setFilterSingleRequests('/moves/requested'),
  dashboard
)

// Export
module.exports = {
  router,
  mountpath: '/',
}
