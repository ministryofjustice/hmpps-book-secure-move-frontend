const { flattenDeep, sortBy } = require('lodash')

const apiClient = require('../lib/api-client')()

const referenceDataService = {
  getGenders() {
    return apiClient.findAll('gender').then(response => response.data)
  },

  getEthnicities() {
    return apiClient.findAll('ethnicity').then(response => response.data)
  },

  getAssessmentQuestions(category) {
    return apiClient
      .findAll('assessment_question', {
        'filter[category]': category,
      })
      .then(response => response.data)
  },

  getLocations({ filter, combinedData, page = 1 } = {}) {
    return apiClient
      .findAll('location', {
        ...filter,
        page,
        per_page: 100,
      })
      .then(response => {
        const { data, links } = response
        const locations = combinedData
          ? flattenDeep([combinedData, ...response.data])
          : data

        if (!links.next) {
          return sortBy(locations, 'title')
        }

        return referenceDataService.getLocations({
          filter,
          page: page + 1,
          combinedData: locations,
        })
      })
  },

  getLocationById(id) {
    if (!id) {
      return Promise.reject(new Error('No location ID supplied'))
    }

    return apiClient.find('location', id).then(response => response.data)
  },

  getLocationByNomisAgencyId(nomisAgencyId) {
    return referenceDataService
      .getLocations({
        filter: {
          'filter[nomis_agency_id]': nomisAgencyId,
        },
      })
      .then(results => results[0])
  },

  getLocationsByNomisAgencyId(ids = []) {
    return referenceDataService.mapLocationIdsToLocations(
      ids,
      referenceDataService.getLocationByNomisAgencyId
    )
  },

  getLocationsByType(type) {
    return referenceDataService.getLocations({
      filter: {
        'filter[location_type]': type,
      },
    })
  },

  getLocationsBySupplierId(supplierId) {
    return referenceDataService.getLocations({
      filter: {
        'filter[supplier_id]': supplierId,
      },
    })
  },

  mapLocationIdsToLocations(ids, callback) {
    const locationPromises = ids.map(id => {
      return callback(id).catch(() => false)
    })
    return Promise.all(locationPromises).then(locations =>
      locations.filter(Boolean)
    )
  },

  getSuppliers() {
    return apiClient.findAll('supplier').then(response => response.data)
  },

  getSupplierByKey(key) {
    if (!key) {
      return Promise.reject(new Error('No supplier key provided'))
    }

    return apiClient.find('supplier', key).then(response => response.data)
  },
}

module.exports = referenceDataService
