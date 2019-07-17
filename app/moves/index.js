// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { download, list } = require('./controllers')
const { setMoveDate, setFromLocation, setMovesByDate } = require('./middleware')

const uuidRegex =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'

// Define param middleware
router.param('locationId', setFromLocation)

// Define routes
router.use(setMoveDate)
router.get(['/', `/:locationId(${uuidRegex})`], setMovesByDate, list)
router.get(
  [
    '/download.:extension(csv|json)',
    `/:locationId(${uuidRegex})/download.:extension(csv|json)`,
  ],
  setMovesByDate,
  download
)

// Export
module.exports = {
  router,
  mountpath: '/moves',
}
