// const { mapKeys, mapValues, uniqBy, omitBy, isNil } = require('lodash')

const personService = require('./person')

// const apiClient = require('../lib/api-client')()

// const unformat = require('./profile/profile.unformat')

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

const profileService = {
  transform(profile) {
    if (!profile) {
      return profile
    }

    return {
      ...profile,
      person: personService.transform(profile.person),
    }
    // return {
    //   ...person,
    //   image_url: `/person/${person.id}/image`,
    //   fullname: [person.last_name, person.first_names]
    //     .filter(Boolean)
    //     .join(', '),
    // }
  },

  format(data) {
    return data
    // const existingIdentifiers = data.identifiers || []
    // const formatted = mapValues(data, (value, key) => {
    //   if (typeof value === 'string') {
    //     if (relationshipKeys.includes(key)) {
    //       return { id: value }
    //     }

    //     if (identifierKeys.includes(key)) {
    //       return { value, identifier_type: key }
    //     }
    //   }

    //   return value
    // })

    // const identifiers = uniqBy(
    //   [
    //     ...identifierKeys.map(key => formatted[key]).filter(Boolean),
    //     ...existingIdentifiers,
    //   ],
    //   'identifier_type'
    // )

    // return omitBy(
    //   {
    //     ...formatted,
    //     identifiers:
    //       identifiers.length || data.identifiers ? identifiers : null,
    //   },
    //   isNil
    // )
  },

  unformat(
    profile,
    fields = [],
    {
      assessment = assessmentKeys,
      explicitAssessment = explicitAssessmentKeys,
    } = {}
  ) {
    return profile
    // return unformat(person, fields, {
    //   identifier,
    //   relationship,
    //   date,
    //   assessment,
    //   explicitAssessment,
    // })
  },

  create(data) {
    // return apiClient
    //   .create('profile', profileService.format(data))
    //   .then(response => response.data)
    //   .then(person => profileService.transform(person))
  },

  update(data) {
    if (!data.id) {
    }

    // return apiClient
    //   .update('profile', profileService.format(data))
    //   .then(response => response.data)
    //   .then(person => profileService.transform(person))
  },
}

module.exports = profileService
