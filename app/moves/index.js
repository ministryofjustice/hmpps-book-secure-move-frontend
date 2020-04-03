// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { protectRoute } = require('../../common/middleware/permissions')
const { dashboard, download, list, listByStatus } = require('./controllers')
const {
  redirectBaseUrl,
  saveUrl,
  setDateRange,
  setPeriod,
  setFromLocation,
  setMoveTypeNavigation,
  setPagination,
  setMovesByDateAndLocation,
  setMovesByDateRangeAndStatus,
  setMovesByDateAllLocations,
  setDashboardMoveSummary,
} = require('./middleware')

const uuidRegex =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'

// Define param middleware
router.param('locationId', setFromLocation)
router.param('period', setPeriod)
router.param('date', setDateRange)

// Define shared middleware
router.use('^([^.]+)$', saveUrl)

// Define routes
router.get('/', redirectBaseUrl)
router.get(
  '/:period(week|day)/:date/:view(outgoing)',
  protectRoute('moves:view:all'),
  setMovesByDateAllLocations,
  setPagination,
  list
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})`,
  protectRoute('moves:view:by_location'),
  protectRoute('moves:view:proposed'),
  setMoveTypeNavigation,
  setDashboardMoveSummary,
  setPagination,
  dashboard
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/:view(outgoing)`,
  protectRoute('moves:view:by_location'),
  setMovesByDateAndLocation,
  setPagination,
  list
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/:status(proposed|requested,accepted,completed|rejected)`,
  protectRoute('moves:view:by_location'),
  protectRoute('moves:view:proposed'),
  setMoveTypeNavigation,
  setMovesByDateRangeAndStatus,
  setPagination,
  listByStatus
)
router.get(
  '/:period(week|day)/:date/:view(outgoing)/download.:extension(csv|json)',
  protectRoute('moves:download:all'),
  setMovesByDateAllLocations,
  download
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/:view(outgoing)/download.:extension(csv|json)`,
  protectRoute('moves:download:by_location'),
  setMovesByDateAndLocation,
  download
)
// Export
module.exports = {
  router,
  mountpath: '/moves',
}
