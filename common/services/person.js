const { mapKeys, mapValues, uniqBy, omitBy, isNil } = require('lodash')

const apiClient = require('../lib/api-client')()

const unformat = require('./person-unformat')

const relationshipKeys = ['gender', 'ethnicity']
const identifierKeys = [
  'police_national_computer',
  'criminal_records_office',
  'prison_number',
  'niche_reference',
  'athena_reference',
]
const dateKeys = ['date_of_birth']
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
const explicitAssessmentKeys = ['special_vehicle']

const personService = {
  transform(person = {}) {
    return {
      ...person,
      image_url: `/person/${person.id}/image`,
      fullname: [person.last_name, person.first_names]
        .filter(Boolean)
        .join(', '),
    }
  },

  format(data) {
    const existingIdentifiers = data.identifiers || []
    const formatted = mapValues(data, (value, key) => {
      if (typeof value === 'string') {
        if (relationshipKeys.includes(key)) {
          return { id: value }
        }

        if (identifierKeys.includes(key)) {
          return { value, identifier_type: key }
        }
      }

      return value
    })

    const identifiers = uniqBy(
      [
        ...identifierKeys.map(key => formatted[key]).filter(Boolean),
        ...existingIdentifiers,
      ],
      'identifier_type'
    )

    return omitBy(
      {
        ...formatted,
        identifiers:
          identifiers.length || data.identifiers ? identifiers : null,
      },
      isNil
    )
  },

  unformat(person, fields = []) {
    return unformat(person, fields, {
      identifier: identifierKeys,
      relationship: relationshipKeys,
      date: dateKeys,
      assessment: assessmentKeys,
      explicitAssessment: explicitAssessmentKeys,
    })
  },

  create(data) {
    return apiClient
      .create('person', personService.format(data))
      .then(response => response.data)
      .then(person => personService.transform(person))
  },

  update(data) {
    if (!data.id) {
      return
    }

    return apiClient
      .update('person', personService.format(data))
      .then(response => response.data)
      .then(person => personService.transform(person))
  },

  getImageUrl(personId) {
    if (!personId) {
      return Promise.reject(new Error('No ID supplied'))
    }

    return apiClient
      .one('person', personId)
      .all('image')
      .get()
      .then(response => response.data.url)
  },

  getCourtCases(personId) {
    if (!personId) {
      return Promise.reject(new Error('No ID supplied'))
    }

    return apiClient
      .one('person', personId)
      .all('court_case')
      .get()
      .then(response => response.data)
  },

  getByIdentifiers(identifiers) {
    const filter = mapKeys(identifiers, (value, key) => `filter[${key}]`)

    return apiClient
      .findAll('person', filter)
      .then(response => response.data)
      .then(data => data.map(person => personService.transform(person)))
  },
}

module.exports = personService
