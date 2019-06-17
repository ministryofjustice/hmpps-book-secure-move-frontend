const FormController = require('./form')
const referenceDataService = require('../../../common/services/reference-data')

class MoveDetailsController extends FormController {
  async configure (req, res, next) {
    try {
      const courts = await referenceDataService.getLocations('court')
      const prisons = await referenceDataService.getLocations('prison')
      const courtOptions = courts.map(referenceDataService.mapToOption)
      const prisonOptions = prisons.map(referenceDataService.mapToOption)

      req.form.options.fields.to_location_court.items = referenceDataService.insertInitialOption(courtOptions, 'court')
      req.form.options.fields.to_location_prison.items = referenceDataService.insertInitialOption(prisonOptions, 'prison')

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = MoveDetailsController
