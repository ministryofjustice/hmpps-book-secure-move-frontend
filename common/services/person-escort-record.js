const { FRAMEWORKS } = require('../../config')
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
        version: FRAMEWORKS.CURRENT_VERSION,
        profile: {
          id: profileId,
        },
      })
      .then(response => response.data)
  },

  confirm(id) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    return apiClient
      .update('person_escort_record', {
        id,
        status: 'confirmed',
      })
      .then(this.transformResponse)
  },

  getById(id) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    return apiClient
      .find('person_escort_record', id)
      .then(this.transformResponse)
  },

  respond(id, data = []) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    if (data.length === 0) {
      return Promise.resolve([])
    }

    return apiClient
      .one('person_escort_record', id)
      .all('framework_response')
      .patch(data)
  },
}

module.exports = personEscortRecordService
