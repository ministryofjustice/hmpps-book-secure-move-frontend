const apiClient = require('../lib/api-client')()

const noIdMessage = 'No resource ID supplied'

const personEscortRecordService = {
  getById(id) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    return apiClient
      .find('person_escort_record', id)
      .then(response => response.data)
  },
}

module.exports = personEscortRecordService
