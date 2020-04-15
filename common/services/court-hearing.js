const apiClient = require('../lib/api-client')()

const courtHearingService = {
  create(data) {
    return apiClient
      .create('court_hearing', data)
      .then(response => response.data)
  },
}

module.exports = courtHearingService
