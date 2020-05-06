// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { setDateRange, setDatePeriod } = require('../../common/middleware')
const { protectRoute } = require('../../common/middleware/permissions')

const {
  dashboard,
  download,
  listAsCards,
  listAsTable,
} = require('./controllers')
const {
  redirectBaseUrl,
  saveUrl,
  setFromLocation,
  setFilterSingleRequests,
  setPagination,
  setMovesByDateRangeAndStatus,
  setResultsOutgoing,
  setDashboardMoveSummary,
} = require('./middleware')

const uuidRegex =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'

// Define param middleware
router.param('locationId', setFromLocation)
router.param('period', setDatePeriod)
router.param('date', setDateRange)

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
  `/:period(week|day)/:date/:locationId(${uuidRegex})`,
  protectRoute('moves:view:proposed'),
  setFilterSingleRequests,
  setDashboardMoveSummary,
  setPagination,
  dashboard
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/:view(outgoing)`,
  protectRoute('moves:view:outgoing'),
  setResultsOutgoing,
  setPagination,
  listAsCards
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/:status(pending|approved|rejected)`,
  protectRoute('moves:view:proposed'),
  setMovesByDateRangeAndStatus,
  setFilterSingleRequests,
  setPagination,
  listAsTable
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
// Export
module.exports = {
  router,
  mountpath: '/moves',
}
