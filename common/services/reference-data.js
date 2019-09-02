const { flattenDeep, sortBy } = require('lodash')

const apiClient = require('../lib/api-client')()

function getGenders() {
  return apiClient.findAll('gender').then(response => response.data)
}

function getEthnicities() {
  return apiClient.findAll('ethnicity').then(response => response.data)
}

function getAssessmentQuestions(category) {
  return apiClient
    .findAll('assessment_question', {
      'filter[category]': category,
    })
    .then(response => response.data)
}

function getLocations({ type, nomisAgencyId, combinedData, page = 1 } = {}) {
  return apiClient
    .findAll('location', {
      page,
      per_page: 100,
      'filter[location_type]': type,
      'filter[nomis_agency_id]': nomisAgencyId,
    })
    .then(response => {
      const { data, links } = response
      const locations = combinedData
        ? flattenDeep([combinedData, ...response.data])
        : data

      if (!links.next) {
        return sortBy(locations, 'title')
      }

      return getLocations({
        type,
        nomisAgencyId,
        combinedData: locations,
        page: page + 1,
      })
    })
}

function getLocationById(id) {
  return apiClient.find('location', id).then(response => response.data)
}

function getLocationByNomisAgencyId(nomisAgencyId) {
  return getLocations({ nomisAgencyId }).then(results => results[0])
}

function getLocationsById(ids = []) {
  return _mapLocationIdsToLocations(ids, getLocationById)
}

function getLocationsByNomisAgencyId(ids = []) {
  return _mapLocationIdsToLocations(ids, getLocationByNomisAgencyId)
}

function _mapLocationIdsToLocations(ids, callback) {
  const locationPromises = ids.map(id => {
    return callback(id).catch(() => false)
  })
  return Promise.all(locationPromises).then(locations =>
    locations.filter(Boolean)
  )
}

module.exports = {
  getGenders,
  getEthnicities,
  getAssessmentQuestions,
  getLocations,
  getLocationById,
  getLocationsById,
  getLocationByNomisAgencyId,
  getLocationsByNomisAgencyId,
}
