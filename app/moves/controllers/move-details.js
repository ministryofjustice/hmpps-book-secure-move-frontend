const dateFns = require('date-fns')

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

  process (req, res, next) {
    const {
      date_type: dateType,
      to_location_type: locationType,
    } = req.form.values

    // process move date
    if (dateType === 'custom') {
      req.form.values.date = req.form.values.date_custom
    } else {
      req.form.values.date_custom = ''
      req.form.values.date = dateType === 'today' ? dateFns.startOfToday() : dateFns.startOfTomorrow()
    }

    // process to location
    req.form.values.to_location = req.form.values[`to_location_${locationType}`]

    // TODO: Until we can get the location based on the user's location
    // we need to mock it
    req.form.values.from_location = req.form.values[`to_location_${locationType}`]

    next()
  }
}

module.exports = MoveDetailsController
