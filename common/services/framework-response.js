const apiClient = require('../lib/api-client')()

const noIdMessage = 'No resource ID supplied'

const frameworkResponseService = {
  update(data = {}) {
    if (!data.id) {
      return Promise.reject(new Error(noIdMessage))
    }

    return apiClient
      .update('framework_response', data)
      .then(response => response.data)
  },
}

module.exports = frameworkResponseService
