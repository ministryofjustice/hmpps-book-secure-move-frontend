// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const policeCustodyFormController = require('./controllers')

// Define routes
router.get('/', (req, res) => {
  res.render('police-custody-form/police-custody-form')
})

router.post('/', policeCustodyFormController.addEvents)

// Export
module.exports = {
  router,
  mountpath: '/police-custody-form',
}
