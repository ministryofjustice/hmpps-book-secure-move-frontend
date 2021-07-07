const { flattenDeep, sortBy } = require('lodash')

const restClient = require('../lib/api-client/rest-client')

const BaseService = require('./base')

const locationInclude = ['suppliers']
const regionInclude = ['locations']

function sortLocations(locations) {
  return sortBy(locations, ({ title = '' }) => title.toUpperCase())
}

class ReferenceDataService extends BaseService {
  getGenders() {
    return this.apiClient.findAll('gender').then(response => response.data)
  }

  getEthnicities() {
    return this.apiClient.findAll('ethnicity').then(response => response.data)
  }

  getAssessmentQuestions(category) {
    return this.apiClient
      .findAll('assessment_question', {
        'filter[category]': category,
      })
      .then(response => response.data)
  }

  getLocations({ filter, combinedData, page = 1 } = {}) {
    return this.apiClient
      .findAll('location', {
        ...filter,
        page,
        per_page: 100,
        include: locationInclude,
      })
      .then(response => {
        const { data, links } = response
        const locations = combinedData
          ? flattenDeep([combinedData, ...response.data])
          : data

        const hasNext = links.next && data.length !== 0

        if (!hasNext) {
          return sortLocations(locations)
          // return sortBy(locations, location => location?.title?.toUpperCase())
        }

        return this.getLocations({
          filter,
          page: page + 1,
          combinedData: locations,
        })
      })
  }

  getLocationById(id) {
    if (!id) {
      return Promise.reject(new Error('No location ID supplied'))
    }

    return this.apiClient
      .find('location', id, { include: locationInclude })
      .then(response => response.data)
  }

  getLocationByNomisAgencyId(nomisAgencyId) {
    return this.getLocations({
      filter: {
        'filter[nomis_agency_id]': nomisAgencyId,
      },
    }).then(results => results[0])
  }

  getLocationsByNomisAgencyId(ids = []) {
    return this.mapLocationIdsToLocations(ids, id =>
      this.getLocationByNomisAgencyId(id)
    )
  }

  getLocationsByType(types = []) {
    return this.getLocations({
      filter: {
        'filter[location_type]': types.length ? types.join(',') : undefined,
      },
    })
  }

  async getLocationsBySupplierId(supplierId) {
    const { data } = await restClient(`/suppliers/${supplierId}/locations`, {
      per_page: 2000,
    })
    const locations = data.map(location => {
      const { attributes, relationships, ...values } = location
      return {
        ...values,
        ...attributes,
      }
    })

    return sortLocations(locations)
  }

  getRegionById(id) {
    if (!id) {
      return Promise.reject(new Error('No region ID supplied'))
    }

    return this.apiClient
      .find('region', id, { include: regionInclude })
      .then(response => response.data)
  }

  getRegions({ page = 1, combinedData } = {}) {
    return this.apiClient
      .findAll('region', { include: regionInclude, page, per_page: 100 })
      .then(response => {
        const { data, links } = response
        const regions = combinedData
          ? flattenDeep([combinedData, ...data])
          : data

        const hasNext = links && links.next && data.length !== 0

        if (!hasNext) {
          return sortBy(regions, 'title')
        }

        return this.getRegions({
          page: page + 1,
          combinedData: regions,
        })
      })
  }

  mapLocationIdsToLocations(ids, callback) {
    const locationPromises = ids.map(id => {
      return callback(id).catch(() => false)
    })
    return Promise.all(locationPromises)
      .then(locations => locations.filter(Boolean))
      .then(locations => sortLocations(locations))
  }

  getSuppliers() {
    return this.apiClient.findAll('supplier').then(response => response.data)
  }

  getSupplierByKey(key) {
    if (!key) {
      return Promise.reject(new Error('No supplier key provided'))
    }

    return this.apiClient.find('supplier', key).then(response => response.data)
  }

  getPrisonTransferReasons() {
    return this.apiClient
      .findAll('prison_transfer_reason')
      .then(response => response.data)
  }

  getAllocationComplexCases() {
    return this.apiClient.findAll('allocation_complex_case').then(response => {
      return response.data
    })
  }
}

module.exports = ReferenceDataService
