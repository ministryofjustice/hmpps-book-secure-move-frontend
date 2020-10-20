const { mapValues, pickBy } = require('lodash')

const ApiClient = require('../lib/api-client')

const addRequestContext = req => {
  const apiClient = ApiClient(req)

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

    create(data, disableSaveToNomis = false) {
      const params = {}

      if (disableSaveToNomis) {
        params.do_not_save_to_nomis = true
      }

      return apiClient
        .create('court_hearing', courtHearingService.format(data), params)
        .then(response => response.data)
    },
  }
  return courtHearingService
}

const courtHearingService = addRequestContext()
courtHearingService.addRequestContext = addRequestContext

module.exports = courtHearingService
