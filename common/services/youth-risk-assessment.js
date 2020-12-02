const { FRAMEWORKS } = require('../../config')
const apiClient = require('../lib/api-client')()

const noIdMessage = 'No resource ID supplied'

const youthRiskAssessmentService = {
  create(moveId) {
    return apiClient
      .create('youth_risk_assessment', {
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
      .update('youth_risk_assessment', {
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
      .find('youth_risk_assessment', id, { include })
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
      .one('youth_risk_assessment', id)
      .all('framework_response')
      .patch(data)
  },
}

module.exports = youthRiskAssessmentService
