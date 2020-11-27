const { FRAMEWORKS } = require('../../config')
const apiClient = require('../lib/api-client')()

const noIdMessage = 'No resource ID supplied'

const personEscortRecordService = {
  create(moveId) {
    return apiClient
      .create('person_escort_record', {
        version: FRAMEWORKS.CURRENT_VERSION,
        move: {
          id: moveId,
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
      .then(response => response.data)
  },

  getById(id) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    const include = [
      'profile',
      'profile.person',
      'framework',
      'responses',
      'responses.question',
      'responses.question.descendants.**',
      'responses.nomis_mappings',
      'flags',
      'prefill_source',
      'move',
    ]

    return apiClient
      .find('person_escort_record', id, { include })
      .then(response => response.data)
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
