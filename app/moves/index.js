// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { protectRoute } = require('../../common/middleware/permissions')
const { download, list, listProposed } = require('./controllers')
const {
  redirectBaseUrl,
  saveUrl,
  setMoveDate,
  setFromLocation,
  setPagination,
  setMovesByDateAndLocation,
  setMovesByDateAllLocations,
} = require('./middleware')

const uuidRegex =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'

// Define param middleware
router.param('locationId', setFromLocation)
router.param('date', setMoveDate)

// Define shared middleware
router.use('^([^.]+)$', saveUrl)

// Define routes
router.get('/', redirectBaseUrl)
router.get(
  '/:date',
  protectRoute('moves:view:all'),
  setMovesByDateAllLocations,
  setPagination,
  list
)
router.get(
  `/:date/:locationId(${uuidRegex})`,
  protectRoute('moves:view:by_location'),
  setMovesByDateAndLocation,
  setPagination,
  list
)
router.get(
  `/:date/:locationId(${uuidRegex})/proposed`,
  protectRoute('moves:view:by_location'),
  protectRoute('moves:view:proposed'),
  setMovesByDateAndLocation,
  setPagination,
  listProposed
)
router.get(
  '/:date/download.:extension(csv|json)',
  protectRoute('moves:download:all'),
  setMovesByDateAllLocations,
  download
)
router.get(
  `/:date/:locationId(${uuidRegex})/download.:extension(csv|json)`,
  protectRoute('moves:download:by_location'),
  setMovesByDateAndLocation,
  download
)

// Export
module.exports = {
  router,
  mountpath: '/moves',
}
