// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { protectRoute } = require('../../common/middleware/permissions')
const { download, list } = require('./controllers')
const {
  redirectUsers,
  storeQuery,
  setMoveDate,
  setFromLocation,
  setPagination,
  setMovesByDate,
} = require('./middleware')

const uuidRegex =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'

// Define param middleware
router.param('locationId', setFromLocation)

// Define routes
router.use(storeQuery)
router.use(setMoveDate)
router.get(
  '/',
  redirectUsers,
  protectRoute('moves:view:all'),
  setMovesByDate,
  setPagination,
  list
)
router.get(
  `/:locationId(${uuidRegex})`,
  protectRoute('moves:view:by_location'),
  setMovesByDate,
  setPagination,
  list
)
router.get(
  '/download.:extension(csv|json)',
  protectRoute('moves:download:all'),
  setMovesByDate,
  download
)
router.get(
  `/:locationId(${uuidRegex})/download.:extension(csv|json)`,
  protectRoute('moves:download:by_location'),
  setMovesByDate,
  download
)

// Export
module.exports = {
  router,
  mountpath: '/moves',
}
