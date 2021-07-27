const FormWizardController = require('../../../../common/controllers/form-wizard')

class CreateAllocationBaseController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setCancelUrl)
  }

  setCancelUrl(req, res, next) {
    res.locals.cancelUrl = '/allocations'
    next()
  }
}

module.exports = CreateAllocationBaseController
