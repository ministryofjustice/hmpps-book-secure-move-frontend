const dateFns = require('date-fns')

const FormController = require('./new.form')
const filters = require('../../../config/nunjucks/filters')
const fieldHelpers = require('../../../common/helpers/field')
const referenceDataService = require('../../../common/services/reference-data')
const referenceDataHelpers = require('../../../common/helpers/reference-data')

class MoveDetailsController extends FormController {
  async configure(req, res, next) {
    try {
      const courts = await referenceDataService.getLocations({
        type: 'court',
      })
      const prisons = await referenceDataService.getLocations({
        type: 'prison',
      })

      const {
        to_location_court: toLocationCourt,
        to_location_prison: toLocationPrison,
        date_type: dateType,
      } = req.form.options.fields

      toLocationCourt.items = fieldHelpers.insertInitialOption(
        courts
          .filter(referenceDataHelpers.filterDisabled())
          .map(fieldHelpers.mapReferenceDataToOption),
        'court'
      )
      toLocationPrison.items = fieldHelpers.insertInitialOption(
        prisons
          .filter(referenceDataHelpers.filterDisabled())
          .map(fieldHelpers.mapReferenceDataToOption),
        'prison'
      )

      // translate date type options early to cater for date injection
      const { items } = dateType
      items[0].text = req.t(items[0].text, {
        date: filters.formatDateWithDay(res.locals.TODAY),
      })
      items[1].text = req.t(items[1].text, {
        date: filters.formatDateWithDay(res.locals.TOMORROW),
      })

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  process(req, res, next) {
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
      moveDate =
        dateType === 'today'
          ? dateFns.startOfToday()
          : dateFns.startOfTomorrow()
    }

    req.form.values.date = dateFns.format(moveDate, 'YYYY-MM-DD')

    // process locations
    req.form.values.to_location = req.form.values[`to_location_${locationType}`]
    // if req.session.currentLocation doesn't exist the parent controller will error
    req.form.values.from_location = req.session.currentLocation.id

    next()
  }
}

module.exports = MoveDetailsController
