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
    req.journeyModel.reset()
    req.sessionModel.reset()

    if (req.query.returnUrl) {
      return res.redirect(decodeURI(req.query.returnUrl))
    }

    res.redirect(`/move/${req.move.id}`)
  }
}

module.exports = NewAssessmentController
