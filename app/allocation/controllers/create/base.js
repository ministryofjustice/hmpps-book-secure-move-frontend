const FormWizardController = require('../../../../common/controllers/form-wizard')

class CreateAllocationBaseController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setButtonText)
    this.use(this.setCancelUrl)
  }

  setButtonText(req, res, next) {
    const nextStep = this.getNextStep(req, res)
    const steps = Object.keys(req.form.options.steps)
    const lastStep = steps[steps.length - 1]
    const buttonText = nextStep.includes(lastStep)
      ? 'actions::create_allocation'
      : 'actions::continue'

    req.form.options.buttonText = req.form.options.buttonText || buttonText

    next()
  }

  setCancelUrl(req, res, next) {
    res.locals.cancelUrl = '/allocations'
    next()
  }
}

module.exports = CreateAllocationBaseController
