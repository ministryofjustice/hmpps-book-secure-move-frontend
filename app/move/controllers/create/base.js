const FormWizardController = require('../../../../common/controllers/form-wizard')

class CreateBaseController extends FormWizardController {
  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkCurrentLocation)
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setCancelUrl)
  }

  setCancelUrl(req, res, next) {
    res.locals.cancelUrl = res.locals.MOVES_URL
    next()
  }

  checkCurrentLocation(req, res, next) {
    if (!req.session.currentLocation) {
      const error = new Error('Current location is not set in session.')
      return next(error)
    }

    next()
  }
}

module.exports = CreateBaseController
