const apiClient = require('../lib/api-client')()
const profileService = require('../services/profile')

const noIdMessage = 'No resource ID supplied'

const personEscortRecordService = {
  transformResponse({ data = {} } = {}) {
    return {
      ...data,
      profile: profileService.transform(data.profile),
    }
  },

  create(profileId) {
    return apiClient
      .create('person_escort_record', {
        profile: {
          id: profileId,
        },
      })
      .then(response => response.data)
  },

  getById(id) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    return apiClient
      .find('person_escort_record', id)
      .then(this.transformResponse)
  },
}

module.exports = personEscortRecordService
