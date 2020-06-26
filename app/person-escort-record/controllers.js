const FormWizardController = require('../../common/controllers/form-wizard')

class FrameworksController extends FormWizardController {
  successHandler(req, res, next) {
    if (req.body.save_and_return_to_overview) {
      return res.redirect(req.baseUrl)
    }

    super.successHandler(req, res, next)
  }
}

module.exports = {
  FrameworksController,
}
