// NPM dependencies
const router = require('express').Router({ mergeParams: true })

const policeCustodyFormController = require('./controllers')

// Define routes
router.get('/', (req, res) => {
  delete res.breadcrumb
  res.locals.formErrors = req.session.errors
  res.locals.showErrorsSummary = req.session.showErrorsSummary
  res.locals.formData = req.session.formData

  res.render('police-custody-form/police-custody-form')
  delete req.session.errors
  delete req.session.showErrorsSummary
  delete req.session.formData
})

router.post('/', policeCustodyFormController.addEvents)

// Export
module.exports = {
  router,
  mountpath: '/police-custody-form',
}
