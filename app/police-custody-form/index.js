// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const policeCustodyFormController = require('./controllers')

// Define routes
router.get('/', (req, res) => {
  delete res.breadcrumb
  res.locals.formErrors = req.session.errors

  res.render('police-custody-form/police-custody-form')
  delete req.session.errors
})

router.post('/', policeCustodyFormController.addEvents)

// Export
module.exports = {
  router,
  mountpath: '/police-custody-form',
}
