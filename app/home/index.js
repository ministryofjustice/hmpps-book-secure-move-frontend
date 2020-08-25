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

const { FILTERS } = require('./constants')
const { dashboard } = require('./controllers')
const { movesRedirect } = require('./middleware')

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
  dashboard
)

// Export
module.exports = {
  router,
  mountpath: '/',
}
