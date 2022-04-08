// NPM dependencies
const router = require('express').Router({ mergeParams: true })

// Define routes
router.get('/', (req, res) => {
  res.render('police-custody-form/police-custody-form')
})

router.post('/', function (req, res) {
  const moveId = req.body.moveId

  res.redirect(`move/${moveId}/warnings`)
})

// Export
module.exports = {
  router,
  mountpath: '/police-custody-form',
}
