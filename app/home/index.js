// NPM dependencies
const router = require('express').Router()

// Local dependencies
const {
  setFilterAllocations,
  setBodyAllocations,
} = require('../allocations/middleware')
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
  setBodyAllocations,
  setBodySingleRequests,
  overrideBodySingleRequests,
  setFilterSingleRequests(FILTERS.requested),
  setFilterAllocations(FILTERS.allocations),
  dashboard
)

// Export
module.exports = {
  mountpath: '/',
  router,
}
