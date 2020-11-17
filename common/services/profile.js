const { get } = require('lodash')

const apiClient = require('../lib/api-client')()

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
]
const explicitAssessmentKeys = ['special_vehicle', 'not_to_be_released']

const allFields = [].concat(assessmentKeys, explicitAssessmentKeys)

const profileService = {
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
  },

  create(personId, data) {
    if (!personId) {
      return Promise.reject(new Error('No Person ID supplied'))
    }

    return apiClient
      .one('person', personId)
      .all('profile')
      .post(data)
      .then(response => response.data)
  },

  async update(data) {
    const personId = get(data, 'person.id')

    if (!personId) {
      return Promise.reject(new Error('No Person ID supplied'))
    }

    return apiClient
      .one('person', personId)
      .one('profile', data.id)
      .patch(data)
      .then(response => response.data)
  },
}

module.exports = profileService
