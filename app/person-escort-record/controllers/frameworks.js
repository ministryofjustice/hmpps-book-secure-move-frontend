const FormWizardController = require('../../../common/controllers/form-wizard')

class FrameworksController extends FormWizardController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setButtonText)
  }

  setButtonText(req, res, next) {
    const { stepType } = req.form.options
    const isInterruptionCard = stepType === 'interruption-card'
    const buttonText = isInterruptionCard
      ? 'actions::continue'
      : 'actions::save_and_continue'

    req.form.options.buttonText = buttonText

    next()
  }

  successHandler(req, res, next) {
    if (req.body.save_and_return_to_overview) {
      return res.redirect(req.baseUrl)
    }

    super.successHandler(req, res, next)
  }
}

module.exports = FrameworksController
