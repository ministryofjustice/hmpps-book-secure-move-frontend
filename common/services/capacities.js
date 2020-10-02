const { flattenDeep, sortBy } = require('lodash')

const apiClient = require('../lib/api-client')()

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}

const capacityDataService = {
  getCapacities({ filter, combinedData, page = 1, include } = {}) {
    return apiClient
      .findAll('location', {
        // ...filter,
        filter: {
          location_type: 'prison',
        },
        page,
        per_page: 100,
        include,
      })
      .then(response => {
        const { data } = response
        const locations = data.map(item => {
          return {
            meta: [
              getRandomInt(-4, 4),
              getRandomInt(-4, 4),
              getRandomInt(-4, 4),
              getRandomInt(-4, 4),
              getRandomInt(-4, 4),
            ],
            ...item,
          }
        })

        return sortBy(locations, 'title')
      })
  },
}

module.exports = capacityDataService
