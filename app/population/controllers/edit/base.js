const { omit } = require('lodash')

const FormWizardController = require('../../../../common/controllers/form-wizard')

class EditPopulationBaseController extends FormWizardController {
  setInitialValues(req, res, next) {
    if (req.journeyModel?.get('history').length === 1 && req.population) {
      const values = omit(req.population, ['moves_from', 'moves_to'])
      req.sessionModel.set(values)
    }

    next()
  }
}

module.exports = EditPopulationBaseController
