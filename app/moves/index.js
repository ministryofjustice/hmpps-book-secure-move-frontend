// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { setDateRange } = require('../../common/middleware')
const { protectRoute } = require('../../common/middleware/permissions')

const { DEFAULTS } = require('./constants')
const { download, listAsCards, listAsTable } = require('./controllers')
const {
  redirectBaseUrl,
  redirectDefaultQuery,
  redirectView,
  saveUrl,
  setFromLocation,
  setBodySingleRequests,
  setFilterSingleRequests,
  setPagination,
  setResultsSingleRequests,
  setResultsOutgoing,
} = require('./middleware')

const uuidRegex =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'

// Define param middleware
router.param('locationId', setFromLocation)
router.param('date', setDateRange)
router.param('view', redirectDefaultQuery(DEFAULTS.QUERY))

// Define shared middleware
router.use('^([^.]+)$', saveUrl)

// Define routes
router.get('/', redirectBaseUrl)
router.get(
  '/:period(week|day)/:date/:view(outgoing)',
  protectRoute('moves:view:all'),
  setResultsOutgoing,
  setPagination,
  listAsCards
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/:view(outgoing)`,
  protectRoute('moves:view:outgoing'),
  setResultsOutgoing,
  setPagination,
  listAsCards
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/:view(requested)`,
  protectRoute('moves:view:proposed'),
  setBodySingleRequests,
  setFilterSingleRequests(),
  setResultsSingleRequests,
  setPagination,
  listAsTable
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/:view(requested)/download.:extension(csv|json)`,
  protectRoute('moves:download'),
  protectRoute('moves:view:proposed'),
  setBodySingleRequests,
  setResultsSingleRequests,
  download
)
router.get(
  '/:period(week|day)/:date/:view(outgoing)/download.:extension(csv|json)',
  protectRoute('moves:download'),
  protectRoute('moves:view:all'),
  setResultsOutgoing,
  download
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/:view(outgoing)/download.:extension(csv|json)`,
  protectRoute('moves:download'),
  setResultsOutgoing,
  download
)
router.get('/:view(outgoing|requested)', redirectView(DEFAULTS.TIME_PERIOD))

// Export
module.exports = {
  router,
  mountpath: '/moves',
}
