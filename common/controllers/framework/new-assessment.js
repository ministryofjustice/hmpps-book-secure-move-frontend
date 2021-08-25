const FormWizardController = require('../form-wizard')

class NewAssessmentController extends FormWizardController {
  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkProfileExists)
  }

  checkProfileExists(req, res, next) {
    if (req.move?.profile?.id) {
      return next()
    }

    const error = new Error('Move profile not found')
    error.statusCode = 404

    next(error)
  }

  successHandler(req, res) {
    const returnUrl = req.sessionModel.get('returnUrl')
    const url = returnUrl || `/move/${req.move.id}`

    req.journeyModel.reset()
    req.sessionModel.reset()

    res.redirect(url)
  }
}

module.exports = NewAssessmentController
