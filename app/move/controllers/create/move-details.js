const { mapKeys, set } = require('lodash')

const fieldHelpers = require('../../../../common/helpers/field')
const referenceDataHelpers = require('../../../../common/helpers/reference-data')
const referenceDataService = require('../../../../common/services/reference-data')

const CreateBaseController = require('./base')

class MoveDetailsController extends CreateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setMoveType)
    this.use(this.setLocationItems('court', 'to_location_court_appearance'))
    this.use(this.setLocationItems('prison', 'to_location_prison'))
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
    const { move_type: moveType } = req.form.values

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
        req.sessionModel.set('to_location_type', locationDetail.location_type)
      }

      super.successHandler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = MoveDetailsController
