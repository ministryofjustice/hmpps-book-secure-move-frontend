const { FRAMEWORKS } = require('../../config')

const { BaseService } = require('./base')

const noIdMessage = 'No resource ID supplied'

class YouthRiskAssessmentService extends BaseService {
  create(moveId) {
    return this.apiClient
      .create('youth_risk_assessment', {
        version: FRAMEWORKS.CURRENT_VERSION,
        move: {
          id: moveId,
        },
      })
      .then(response => response.data)
  }

  confirm(id) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    return this.apiClient
      .update('youth_risk_assessment', {
        id,
        status: 'confirmed',
      })
      .then(response => response.data)
  }

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

    return this.apiClient
      .find('youth_risk_assessment', id, { include })
      .then(response => response.data)
  }

  respond(id, data = []) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    if (data.length === 0) {
      return Promise.resolve([])
    }

    return this.apiClient
      .one('youth_risk_assessment', id)
      .all('framework_response')
      .patch(data)
  }
}

module.exports = YouthRiskAssessmentService
