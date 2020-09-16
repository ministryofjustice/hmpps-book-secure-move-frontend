const { mapKeys, mapValues, uniqBy, omitBy, isNil } = require('lodash')

const apiClient = require('../lib/api-client')()

const unformat = require('./person/person.unformat')

const relationshipKeys = ['gender', 'ethnicity']

const identifierKeys = []
const dateKeys = ['date_of_birth']

const personService = {
  transform(person) {
    if (!person) {
      return person
    }

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

  unformat(
    person,
    fields = [],
    {
      identifier = identifierKeys,
      relationship = relationshipKeys,
      date = dateKeys,
    } = {}
  ) {
    return unformat(person, fields, {
      identifier,
      relationship,
      date,
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

  getActiveCourtCases(personId) {
    if (!personId) {
      return Promise.reject(new Error('No ID supplied'))
    }

    return apiClient
      .one('person', personId)
      .all('court_case')
      .get({
        'filter[active]': true,
        // TODO: remove if/when devour adds model info to get method
        include: ['location'],
      })
      .then(response => response.data)
  },

  getTimetableByDate(personId, date) {
    if (!personId) {
      return Promise.reject(new Error('No ID supplied'))
    }

    return apiClient
      .one('person', personId)
      .all('timetable_entry')
      .get({
        filter: {
          date_from: date,
          date_to: date,
        },
        // TODO: remove if/when devour adds model info to get method
        include: ['location'],
      })
      .then(response => response.data)
  },

  getByIdentifiers(identifiers, { include } = {}) {
    const filter = {
      ...mapKeys(identifiers, (value, key) => `filter[${key}]`),
      include,
    }

    return apiClient
      .findAll('person', filter)
      .then(response => response.data)
      .then(data => data.map(person => personService.transform(person)))
  },
}

module.exports = personService
