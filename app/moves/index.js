// NPM dependencies
const router = require('express').Router()
const viewRouter = require('express').Router({ mergeParams: true })

// Local dependencies
const {
  renderAsCards,
  renderAsTable,
} = require('../../common/controllers/collection')
const {
  redirectDefaultQuery,
  redirectView,
  setContext,
  setDateRange,
  setPagination,
  switchPeriod,
} = require('../../common/middleware/collection')
const { protectRoute } = require('../../common/middleware/permissions')
const setLocation = require('../../common/middleware/set-location')
const setRequestFilters = require('../../common/middleware/set-request-filters')
const requestFilterFields = require('../filters/fields')

const {
  COLLECTION_MIDDLEWARE,
  COLLECTION_BASE_PATH,
  COLLECTION_VIEW_PATH,
  DEFAULTS,
  FILTERS,
  MOUNTPATH,
} = require('./constants')
const { download } = require('./controllers')
const {
  redirectBaseUrl,
  saveUrl,
  setFromLocation,
  setDownloadResultsMoves,
  setDownloadResultsSingleRequests,
  setBodyMoves,
  setBodySingleRequests,
  setBodyRequestFilters,
  setFilterSingleRequests,
  setFilterMoves,
  setResultsSingleRequests,
  setResultsMoves,
} = require('./middleware')

// Define param middleware
router.param('locationId', setLocation)
router.param('date', setDateRange)
router.param('view', redirectDefaultQuery(DEFAULTS.QUERY))

router.use('^([^.]+)$', saveUrl)

// Define routes
viewRouter.get(
  '/:view(requested)',
  protectRoute('moves:view:proposed'),
  setContext('single_requests'),
  setFromLocation,
  COLLECTION_MIDDLEWARE,
  [
    setBodySingleRequests,
    setBodyRequestFilters,
    setFilterSingleRequests(FILTERS.requested),
    setResultsSingleRequests,
    setPagination(MOUNTPATH + COLLECTION_BASE_PATH + COLLECTION_VIEW_PATH),
  ],
  setRequestFilters(requestFilterFields),
  renderAsTable
)
viewRouter.get(
  '/:view(requested)/download.:extension(csv|json)',
  protectRoute('moves:download'),
  protectRoute('moves:view:proposed'),
  setFromLocation,
  [
    setBodySingleRequests,
    setBodyRequestFilters,
    setDownloadResultsSingleRequests,
  ],
  download
)
viewRouter.get(
  '/:view(outgoing)',
  protectRoute('moves:view:outgoing'),
  setContext('outgoing_moves'),
  setFromLocation,
  COLLECTION_MIDDLEWARE,
  [
    setBodyMoves('outgoing', 'fromLocationId'),
    setFilterMoves(FILTERS.outgoing, 'outgoing'),
    setResultsMoves('outgoing', 'to_location'),
  ],
  renderAsCards
)
viewRouter.get(
  '/:view(outgoing)/download.:extension(csv|json)',
  protectRoute('moves:download'),
  protectRoute('moves:view:outgoing'),
  setFromLocation,
  [
    setBodyMoves('outgoing', 'fromLocationId'),
    setDownloadResultsMoves('outgoing'),
  ],
  download
)
viewRouter.get(
  '/:view(incoming)',
  protectRoute('moves:view:incoming'),
  setContext('incoming_moves'),
  setFromLocation,
  COLLECTION_MIDDLEWARE,
  [
    setBodyMoves('incoming', 'toLocationId'),
    setFilterMoves(FILTERS.incoming, 'incoming'),
    setResultsMoves('incoming', 'from_location'),
  ],
  renderAsCards
)
viewRouter.get(
  '/:view(incoming)/download.:extension(csv|json)',
  protectRoute('moves:download'),
  protectRoute('moves:view:incoming'),
  setFromLocation,
  [
    setBodyMoves('incoming', 'toLocationId'),
    setDownloadResultsMoves('incoming'),
  ],
  download
)
viewRouter.get(
  COLLECTION_VIEW_PATH + '/switch-view',
  switchPeriod(DEFAULTS.TIME_PERIOD)
)

router.get('/', redirectBaseUrl)
router.get(COLLECTION_VIEW_PATH, redirectView(DEFAULTS.TIME_PERIOD))
router.use(COLLECTION_BASE_PATH, viewRouter)

// Export
module.exports = {
  router,
  mountpath: MOUNTPATH,
}
