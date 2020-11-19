const apiClient = require('../lib/api-client')()

const noPopulationIdMessage = 'No population ID supplied'

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
}

module.exports = populationService
