const FormWizardController = require('../../../../common/controllers/form-wizard')

class PopulateController extends FormWizardController {
  async saveValues(req, res, next) {
    try {
      const populate = await req.services.population.populate({
        location: req.locationId,
        date: req.date,
      })

      req.sessionModel.set(populate)

      super.saveValues(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = PopulateController
