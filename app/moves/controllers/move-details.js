const dateFns = require('date-fns')

const FormController = require('./form')
const fieldHelpers = require('../../../common/helpers/field')
const referenceDataService = require('../../../common/services/reference-data')

class MoveDetailsController extends FormController {
  async configure (req, res, next) {
    try {
      const courts = await referenceDataService.getLocations('court')
      const prisons = await referenceDataService.getLocations('prison')
      const courtOptions = courts.map(fieldHelpers.mapReferenceDataToOption)
      const prisonOptions = prisons.map(fieldHelpers.mapReferenceDataToOption)

      req.form.options.fields.to_location_court.items = fieldHelpers.insertInitialOption(courtOptions, 'court')
      req.form.options.fields.to_location_prison.items = fieldHelpers.insertInitialOption(prisonOptions, 'prison')

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
    let moveDate

    if (dateType === 'custom') {
      moveDate = req.form.values.date_custom
    } else {
      req.form.values.date_custom = ''
      moveDate = dateType === 'today' ? dateFns.startOfToday() : dateFns.startOfTomorrow()
    }

    req.form.values.date = dateFns.format(moveDate, 'YYYY-MM-DD')

    // process to location
    req.form.values.to_location = req.form.values[`to_location_${locationType}`]

    // TODO: Until we can get the location based on the user's location
    // we need to mock it
    req.form.values.from_location = req.form.values[`to_location_${locationType}`]

    next()
  }
}

module.exports = MoveDetailsController
