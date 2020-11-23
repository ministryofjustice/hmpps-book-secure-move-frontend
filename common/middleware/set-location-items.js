const { set } = require('lodash')

const fieldHelpers = require('../helpers/field')
const referenceDataHelpers = require('../helpers/reference-data')
const referenceDataService = require('../services/reference-data')

const getLocations = async locationTypes => {
  const locations = (
    await Promise.all(
      locationTypes.map(x => referenceDataService.getLocationsByType(x))
    )
  )
    .reduce((acc, val) => acc.concat(val))
    .sort(sortByTitle)
  return locations
}

const sortByTitle = (a, b) => {
  if (a.title < b.title) {
    return -1
  }

  if (a.title > b.title) {
    return 1
  }

  return 0
}

const getLocationItems = (location, locations) => {
  return fieldHelpers.insertInitialOption(
    locations
      .filter(referenceDataHelpers.filterDisabled())
      .map(fieldHelpers.mapReferenceDataToOption),
    location
  )
}

function setLocationItems(locationTypes, fieldName) {
  return async (req, res, next) => {
    const { fields } = req.form.options

    if (!fields[fieldName]) {
      return next()
    }

    try {
      if (!Array.isArray(locationTypes)) {
        locationTypes = [locationTypes]
      }

      const locations = await getLocations(locationTypes)

      const items = getLocationItems(locationTypes[0], locations)

      set(req, `form.options.fields.${fieldName}.items`, items)
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setLocationItems
