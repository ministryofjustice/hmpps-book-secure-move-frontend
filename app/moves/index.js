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
  setTotalMoves,
  setTranslatedMoveTypes,
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
  '/:period(week|day)/:date',
  protectRoute('moves:view:all'),
  setMovesByDateAllLocations,
  setPagination,
  list
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})`,
  protectRoute('moves:view:by_location'),
  setMovesByDateAndLocation,
  setPagination,
  list
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/:view(dashboard)`,
  protectRoute('moves:view:by_location'),
  protectRoute('moves:view:proposed'),
  setMoveTypeNavigation,
  setTotalMoves,
  setTranslatedMoveTypes,
  setPagination,
  dashboard
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/:status(proposed|requested,accepted,completed|rejected)`,
  protectRoute('moves:view:by_location'),
  protectRoute('moves:view:proposed'),
  setMoveTypeNavigation,
  setTranslatedMoveTypes,
  setMovesByDateRangeAndStatus,
  setPagination,
  listByStatus
)
router.get(
  '/:period(week|day)/:date/download.:extension(csv|json)',
  protectRoute('moves:download:all'),
  setMovesByDateAllLocations,
  download
)
router.get(
  `/:period(week|day)/:date/:locationId(${uuidRegex})/download.:extension(csv|json)`,
  protectRoute('moves:download:by_location'),
  setMovesByDateAndLocation,
  download
)
// Export
module.exports = {
  router,
  mountpath: '/moves',
}
