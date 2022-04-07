// NPM dependencies
const router = require('express').Router({ mergeParams: true })

// Define routes
router.get('/', (req, res) => {
  res.render('police-custody-form/police-custody-form')
})

// Export
module.exports = {
  router,
  mountpath: '/police-custody-form',
}
