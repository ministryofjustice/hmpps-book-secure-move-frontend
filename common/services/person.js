const { mapKeys, mapValues, uniqBy, omitBy, isNil } = require('lodash')

const apiClient = require('../lib/api-client')()

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
    const relationshipKeys = ['gender', 'ethnicity']
    const identifierKeys = [
      'police_national_computer',
      'criminal_records_office',
      'prison_number',
      'niche_reference',
      'athena_reference',
    ]

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
        identifiers,
      },
      isNil
    )
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

  getByIdentifiers(identifiers) {
    const filter = mapKeys(identifiers, (value, key) => `filter[${key}]`)

    return apiClient
      .findAll('person', filter)
      .then(response => response.data)
      .then(data => data.map(person => personService.transform(person)))
  },
}

module.exports = personService
