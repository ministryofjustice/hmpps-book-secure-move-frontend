const { get } = require('lodash')

const { BaseService } = require('./base')
const unformat = require('./profile/profile.unformat')

const assessmentKeys = [
  // court
  'solicitor',
  'interpreter',
  'other_court',
  // risk
  'violent',
  'escape',
  'hold_separately',
  'self_harm',
  'concealed_items',
  'other_risks',
  // health
  'special_diet_or_allergy',
  'health_issue',
  'medication',
  'wheelchair',
  'pregnant',
  'other_health',
  'special_vehicle',
  // extradition
  'extradition_flight_number',
  'extradition_flight_date',
  'extradition_flight_time',
]
const explicitAssessmentKeys = ['special_vehicle', 'not_to_be_released']

const allFields = [].concat(assessmentKeys, explicitAssessmentKeys)

class ProfileService extends BaseService {
  unformat(
    profile,
    fields = allFields,
    {
      assessment = assessmentKeys,
      explicitAssessment = explicitAssessmentKeys,
    } = {}
  ) {
    return unformat(profile, fields, {
      assessment,
      explicitAssessment,
    })
  }

  create(personId, data) {
    if (!personId) {
      return Promise.reject(new Error('No Person ID supplied'))
    }

    return this.apiClient
      .one('person', personId)
      .all('profile')
      .post(data, { include: ['person'] })
      .then(response => response.data)
  }

  update(data) {
    const personId = get(data, 'person.id')

    if (!personId) {
      return Promise.reject(new Error('No Person ID supplied'))
    }

    return this.apiClient
      .one('person', personId)
      .one('profile', data.id)
      .patch(data)
      .then(response => response.data)
  }
}

module.exports = ProfileService
