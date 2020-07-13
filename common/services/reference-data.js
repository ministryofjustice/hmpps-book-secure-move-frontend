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

  getLocations({ filter, combinedData, page = 1, include } = {}) {
    return apiClient
      .findAll('location', {
        ...filter,
        page,
        per_page: 100,
        include,
      })
      .then(response => {
        const { data, links } = response
        const locations = combinedData
          ? flattenDeep([combinedData, ...response.data])
          : data

        const hasNext = links.next && data.length !== 0

        if (!hasNext) {
          return sortBy(locations, 'title')
        }

        return referenceDataService.getLocations({
          filter,
          page: page + 1,
          combinedData: locations,
          include,
        })
      })
  },

  getLocationById(id, { include } = {}) {
    if (!id) {
      return Promise.reject(new Error('No location ID supplied'))
    }

    return apiClient
      .find('location', id, { include })
      .then(response => response.data)
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
        cache: false,
        'filter[supplier_id]': supplierId,
      },
    })
  },

  getRegionById(id, { include } = {}) {
    if (!id) {
      return Promise.reject(new Error('No region ID supplied'))
    }

    return apiClient
      .find('region', id, { include })
      .then(response => response.data)
  },

  getRegions({ page = 1, combinedData } = {}) {
    return apiClient
      .findAll('region', { page, per_page: 100 })
      .then(response => {
        const { data, links } = response
        const regions = combinedData
          ? flattenDeep([combinedData, ...data])
          : data

        const hasNext = links && links.next && data.length !== 0

        if (!hasNext) {
          return sortBy(regions, 'title')
        }

        return referenceDataService.getRegions({
          page: page + 1,
          combinedData: regions,
        })
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

  getPrisonTransferReasons() {
    return apiClient
      .findAll('prison_transfer_reason')
      .then(response => response.data)
  },

  getAllocationComplexCases() {
    return apiClient.findAll('allocation_complex_case').then(response => {
      return response.data
    })
  },
}

module.exports = referenceDataService
