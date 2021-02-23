// NPM dependencies
const router = require('express').Router()

// Define routes
router.get('/', (req, res) => res.redirect('/help/accessibility-statement'))
router.get('/accessibility-statement', (req, res) =>
  res.render('help/accessibility-statement')
)

// Export
module.exports = {
  router,
  mountpath: '/help',
}
