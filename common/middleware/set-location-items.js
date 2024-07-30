const { set } = require('lodash')

const fieldHelpers = require('../helpers/field')
const referenceDataHelpers = require('../helpers/reference-data')

const getLocationItems = (location, locations, exclude) => {
  return fieldHelpers.insertInitialOption(
    locations
      .filter(referenceDataHelpers.removeOption(exclude))
      .filter(referenceDataHelpers.filterDisabled())
      .map(fieldHelpers.mapReferenceDataToOption),
    location
  )
}

function setLocationItems(locationTypes, fieldName, extradition, exclude) {
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

      const items = getLocationItems(locationTypes[0], locations, exclude)

      set(req, `form.options.fields.${fieldName}.items`, items)
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setLocationItems
