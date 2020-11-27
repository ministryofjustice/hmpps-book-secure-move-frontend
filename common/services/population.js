const { mapValues, omitBy, isUndefined } = require('lodash')

const apiClient = require('../lib/api-client')()

const noPopulationIdMessage = 'No population ID supplied'
const noLocationIdMessage = 'No location ID supplied'
const noDateMessage = 'No date supplied'

const populationService = {
  format(data) {
    const relationships = ['location']

    return mapValues(omitBy(data, isUndefined), (value, key) => {
      if (relationships.includes(key) && typeof value === 'string') {
        return { id: value }
      }

      return value
    })
  },

  getById(id, { include } = {}) {
    if (!id) {
      return Promise.reject(new Error(noPopulationIdMessage))
    }

    return apiClient
      .find('population', id, { include })
      .then(response => response.data)
  },

  getByIdWithMoves(id) {
    return populationService.getById(id, {
      include: ['moves_from', 'moves_to', 'location'],
    })
  },

  create(data) {
    const { location, date } = data

    if (!location) {
      return Promise.reject(new Error(noLocationIdMessage))
    }

    if (!date) {
      return Promise.reject(new Error(noDateMessage))
    }

    return apiClient
      .create('population', populationService.format(data))
      .then(response => response.data)
  },

  update(data) {
    const { id } = data
    if (!id) {
      return Promise.reject(new Error(noPopulationIdMessage))
    }

    return apiClient
      .update('population', populationService.format(data))
      .then(response => response.data)
  },
}

module.exports = populationService
