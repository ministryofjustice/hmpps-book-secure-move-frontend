const { set } = require('lodash')

const fieldHelpers = require('../helpers/field')
const referenceDataHelpers = require('../helpers/reference-data')
const referenceDataService = require('../services/reference-data')

function setLocationItems(locationType, fieldName) {
  return async (req, res, next) => {
    const { fields } = req.form.options

    if (!fields[fieldName]) {
      return next()
    }

    try {
      if (!Array.isArray(locationType)) {
        locationType = [locationType]
      }

      const locationString = locationType[0]

      const locations = (
        await Promise.all(
          locationType.map(x => referenceDataService.getLocationsByType(x))
        )
      )
        .reduce((acc, val) => acc.concat(val))
        .sort((a, b) => {
          if (a.title < b.title) {
            return -1
          }

          if (a.title > b.title) {
            return 1
          }

          return 0
        })

      const items = fieldHelpers.insertInitialOption(
        locations
          .filter(referenceDataHelpers.filterDisabled())
          .map(fieldHelpers.mapReferenceDataToOption),
        locationString
      )

      set(req, `form.options.fields.${fieldName}.items`, items)
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setLocationItems
