const { mapKeys, set } = require('lodash')
const { format, startOfToday, startOfTomorrow, parseISO } = require('date-fns')

const CreateBaseController = require('./base')
const filters = require('../../../../config/nunjucks/filters')
const fieldHelpers = require('../../../../common/helpers/field')
const referenceDataService = require('../../../../common/services/reference-data')
const referenceDataHelpers = require('../../../../common/helpers/reference-data')

class MoveDetailsController extends CreateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setMoveType)
    this.use(this.setDateType)
    this.use(this.setLocationItems('court', 'to_location_court_appearance'))
    this.use(this.setLocationItems('prison', 'to_location_prison'))
  }

  setDateType(req, res, next) {
    const { date_type: dateType } = req.form.options.fields
    const { items } = dateType

    items[0].text = req.t(items[0].text, {
      date: filters.formatDateWithDay(res.locals.TODAY),
    })
    items[1].text = req.t(items[1].text, {
      date: filters.formatDateWithDay(res.locals.TOMORROW),
    })
    next()
  }

  setLocationItems(locationType, fieldName) {
    return async (req, res, next) => {
      const { fields } = req.form.options

      if (!fields[fieldName]) {
        return next()
      }

      try {
        const locations = await referenceDataService.getLocationsByType(
          locationType
        )
        const items = fieldHelpers.insertInitialOption(
          locations
            .filter(referenceDataHelpers.filterDisabled())
            .map(fieldHelpers.mapReferenceDataToOption),
          locationType
        )

        set(req, `form.options.fields.${fieldName}.items`, items)
        next()
      } catch (error) {
        next(error)
      }
    }
  }

  setMoveType(req, res, next) {
    // This is to ensure any custom move types keep the
    // same key that is used in this controller
    req.form.options.fields = mapKeys(req.form.options.fields, (value, key) =>
      key.includes('move_type') ? 'move_type' : key
    )

    next()
  }

  process(req, res, next) {
    const { date_type: dateType, move_type: moveType } = req.form.values

    // process move date
    let moveDate

    if (dateType === 'custom') {
      moveDate = parseISO(req.form.values.date_custom)
    } else {
      req.form.values.date_custom = ''
      moveDate = dateType === 'today' ? startOfToday() : startOfTomorrow()
    }

    req.form.values.date = format(moveDate, 'yyyy-MM-dd')

    // process locations
    req.form.values.to_location = req.form.values[`to_location_${moveType}`]

    next()
  }

  async successHandler(req, res, next) {
    try {
      const { to_location: toLocationId } = req.sessionModel.toJSON()

      if (toLocationId) {
        const locationDetail = await referenceDataService.getLocationById(
          toLocationId
        )

        req.sessionModel.set('to_location', locationDetail)
      }

      super.successHandler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = MoveDetailsController
