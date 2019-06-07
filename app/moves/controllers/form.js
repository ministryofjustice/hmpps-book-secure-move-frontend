const { Controller } = require('hmpo-form-wizard')

class FormController extends Controller {
  errorHandler (err, req, res, next) {
    if (err.redirect) {
      return res.redirect(err.redirect)
    }

    if (err.code === 'SESSION_TIMEOUT') {
      return res.render('form-wizard-timeout', {
        journeyBaseUrl: req.baseUrl,
      })
    }

    super.errorHandler(err, req, res, next)
  }
}

module.exports = FormController
