const { set } = require('lodash')

const fieldHelpers = require('../helpers/field')
const referenceDataHelpers = require('../helpers/reference-data')

const getLocationItems = (currentLocation, location, locations) => {
  return fieldHelpers.insertInitialOption(
    locations
      .filter(referenceDataHelpers.removeOption(currentLocation))
      .filter(referenceDataHelpers.filterDisabled())
      .map(fieldHelpers.mapReferenceDataToOption),
    location
  )
}

function setLocationItems(locationTypes, fieldName, extradition) {
  return async (req, res, next) => {
    const { fields } = req.form.options

    if (!fields[fieldName]) {
      return next()
    }

    try {
      if (!Array.isArray(locationTypes)) {
        locationTypes = [locationTypes]
      }

      const locations = extradition
        ? await req.services.referenceData.getLocationsByTypeAndExtraditionCapable(
            locationTypes
          )
        : await req.services.referenceData.getLocationsByType(locationTypes)

      const items = getLocationItems(
        req.models.move.from_location,
        locationTypes[0],
        locations
      )

      set(req, `form.options.fields.${fieldName}.items`, items)
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setLocationItems
