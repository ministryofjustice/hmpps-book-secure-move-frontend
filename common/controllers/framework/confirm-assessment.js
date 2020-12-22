const FormWizardController = require('../form-wizard')

class ConfirmAssessmentController extends FormWizardController {
  middlewareChecks() {
    this.use(this.checkStatus)
    super.middlewareChecks()
  }

  checkStatus(req, res, next) {
    const moveId = req.move?.id
    const isCompleted = req?.assessment?.status === 'completed'

    if (isCompleted) {
      return next()
    }

    res.redirect(`/move/${moveId}`)
  }

  successHandler(req, res) {
    req.journeyModel.reset()
    req.sessionModel.reset()

    res.redirect(`/move/${req.move.id}`)
  }
}

module.exports = ConfirmAssessmentController
