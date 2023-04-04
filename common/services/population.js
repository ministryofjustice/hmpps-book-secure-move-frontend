const { mapValues, omitBy, isUndefined } = require('lodash')

const { BaseService } = require('./base')

const noPopulationIdMessage = 'No population ID supplied'
const noLocationIdMessage = 'No location ID supplied'
const noDateMessage = 'No date supplied'

class PopulationService extends BaseService {
  format(data) {
    const relationships = ['location']

    return mapValues(omitBy(data, isUndefined), (value, key) => {
      if (relationships.includes(key) && typeof value === 'string') {
        return { id: value }
      }

      return value
    })
  }

  getById(id, { include } = {}) {
    if (!id) {
      return Promise.reject(new Error(noPopulationIdMessage))
    }

    return this.apiClient
      .find('population', id, { include })
      .then(response => response.data)
  }

  getByIdWithMoves(id) {
    return this.getById(id, {
      include: ['moves_from', 'moves_to', 'location'],
    })
  }

  create(data) {
    const { location, date } = data

    if (!location) {
      return Promise.reject(new Error(noLocationIdMessage))
    }

    if (!date) {
      return Promise.reject(new Error(noDateMessage))
    }

    return this.apiClient
      .create('population', this.format(data))
      .then(response => response.data)
  }

  populate(data) {
    const { location, date } = data

    if (!location) {
      return Promise.reject(new Error(noLocationIdMessage))
    }

    if (!date) {
      return Promise.reject(new Error(noDateMessage))
    }

    return this.apiClient
      .request(`${this.apiClient.apiUrl}/populations/new`, 'GET', {
        location_id: location,
        date,
      })
      .then(response => response.data)
  }

  update(data) {
    const { id } = data

    if (!id) {
      return Promise.reject(new Error(noPopulationIdMessage))
    }

    return this.apiClient
      .update('population', this.format(data))
      .then(response => response.data)
  }
}

module.exports = PopulationService
