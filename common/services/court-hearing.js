const { mapValues, pickBy } = require('lodash')

const apiClient = require('../lib/api-client')()

const courtHearingService = {
  format(data) {
    const relationships = ['move']

    return mapValues(pickBy(data), (value, key) => {
      if (relationships.includes(key) && typeof value === 'string') {
        return { id: value }
      }
      return value
    })
  },

  create(data) {
    return apiClient
      .create('court_hearing', courtHearingService.format(data))
      .then(response => response.data)
  },
}

module.exports = courtHearingService
