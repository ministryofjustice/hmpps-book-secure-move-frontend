// NPM dependencies
const router = require('express').Router()

const { determineEntryPoint } = require('./middleware')

// Define routes
router.get('/', determineEntryPoint, (req, res) =>
  res.redirect(res.locals.entryPoint)
)

// Export
module.exports = {
  router,
  mountpath: '/',
}
