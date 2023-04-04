const { mapValues, pickBy } = require('lodash')

const { BaseService } = require('./base')

class CourtHearingService extends BaseService {
  format(data) {
    const relationships = ['move']

    return mapValues(pickBy(data), (value, key) => {
      if (relationships.includes(key) && typeof value === 'string') {
        return { id: value }
      }

      return value
    })
  }

  create(data, disableSaveToNomis = false) {
    const params = {}

    if (disableSaveToNomis) {
      params.do_not_save_to_nomis = true
    }

    return this.apiClient
      .create('court_hearing', this.format(data), params)
      .then(response => response.data)
  }
}

module.exports = CourtHearingService
