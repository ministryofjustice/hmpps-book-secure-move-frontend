// NPM dependencies
const router = require('express').Router()

// Local dependencies
const {
  setFilterAllocations,
  setBodyAllocations,
} = require('../allocations/middleware')
const {
  setBodyMoves,
  setBodySingleRequests,
  setFilterMoves,
  setFilterSingleRequests,
} = require('../moves/middleware')
const { setResultsPopulation } = require('../population/middleware')

const { FILTERS } = require('./constants')
const { dashboard } = require('./controllers')
const { movesRedirect, setUserLocations } = require('./middleware')

// Define routes
router.get(
  '/',
  movesRedirect,
  setBodyMoves('outgoing', 'fromLocationId'),
  setBodyMoves('incoming', 'toLocationId'),
  setBodyAllocations,
  setBodySingleRequests,
  setFilterMoves(FILTERS.outgoing, 'outgoing'),
  setFilterMoves(FILTERS.incoming, 'incoming'),
  setFilterSingleRequests(FILTERS.requested),
  setFilterAllocations(FILTERS.allocations),
  setUserLocations,
  setResultsPopulation,
  dashboard
)

// Export
module.exports = {
  router,
  mountpath: '/',
}
