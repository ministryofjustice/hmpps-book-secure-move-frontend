const FormWizardController = require('../../../../common/controllers/form-wizard')

class LoadPopulationController extends FormWizardController {
  saveValues(req, res, next) {
    req.sessionModel.set(req.population)

    super.saveValues(req, res, next)
  }
}

module.exports = LoadPopulationController
