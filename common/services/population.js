const apiClient = require('../lib/api-client')()

const noPopulationIdMessage = 'No population ID supplied'
const noLocationIdMessage = 'No location ID supplied'
const noDateMessage = 'No date supplied'

const populationService = {
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

  create(locationId, date, data) {
    if (!locationId) {
      return Promise.reject(new Error(noLocationIdMessage))
    }

    if (!date) {
      return Promise.reject(new Error(noDateMessage))
    }

    return apiClient
      .create('population', {
        location: {
          id: locationId,
        },
        date,
        ...data,
      })
      .then(response => response.data)
  },

  update(data) {
    if (!data.id) {
      return Promise.reject(new Error(noPopulationIdMessage))
    }

    return apiClient.update('population', data).then(response => response.data)
  },
}

module.exports = populationService
