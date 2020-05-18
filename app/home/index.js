// NPM dependencies
const router = require('express').Router()

// Local dependencies
const {
  setFilterSingleRequests,
  setBodySingleRequests,
} = require('../moves/middleware')

const { FILTERS } = require('./constants')
const { dashboard } = require('./controllers')
const { overrideBodySingleRequests } = require('./middleware')

// Define routes
router.get(
  '/',
  setBodySingleRequests,
  overrideBodySingleRequests,
  setFilterSingleRequests(FILTERS.requested),
  dashboard
)

// Export
module.exports = {
  router,
  mountpath: '/',
}
