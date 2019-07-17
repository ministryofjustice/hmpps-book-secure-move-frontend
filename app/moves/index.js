// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { download, list } = require('./controllers')
const { setMoveDate, setMovesByDateAndLocation } = require('./middleware')

// Define param middleware

// Define routes
router.get('/', setMoveDate, setMovesByDateAndLocation, list)
router.use(
  '/download.:extension(csv|json)',
  setMoveDate,
  setMovesByDateAndLocation,
  download
)

// Export
module.exports = {
  router,
  mountpath: '/moves',
}
