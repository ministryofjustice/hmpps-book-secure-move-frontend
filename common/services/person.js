const { mapKeys, mapValues, omitBy, isNil } = require('lodash')

const { BaseService } = require('./base')
const unformat = require('./person/person.unformat')

const relationshipKeys = ['gender', 'ethnicity']
const dateKeys = ['date_of_birth']
const noPersonIdMessage = 'No person ID supplied'

class PersonService extends BaseService {
  format(data) {
    const formatted = mapValues(data, (value, key) => {
      if (typeof value === 'string') {
        if (relationshipKeys.includes(key)) {
          return { id: value }
        }
      }

      return value
    })

    return omitBy(formatted, isNil)
  }

  unformat(
    person,
    fields = [],
    { relationship = relationshipKeys, date = dateKeys } = {}
  ) {
    return unformat(person, fields, {
      relationship,
      date,
    })
  }

  create(data) {
    return this.apiClient
      .create('person', this.format(data))
      .then(response => response.data)
  }

  update(data = {}) {
    if (!data.id) {
      return Promise.reject(new Error(noPersonIdMessage))
    }

    return this.apiClient
      .update('person', this.format(data))
      .then(response => response.data)
  }

  _getById(id, options = {}) {
    if (!id) {
      return Promise.reject(new Error(noPersonIdMessage))
    }

    return this.apiClient
      .find('person', id, options)
      .then(response => response.data)
  }

  getById(id) {
    return this._getById(id, { include: ['ethnicity', 'gender', 'category'] })
  }

  getCategory(id) {
    return this._getById(id, { include: ['category'] }).then(
      person => person.category
    )
  }

  getImageUrl(personId) {
    if (!personId) {
      return Promise.reject(new Error('No ID supplied'))
    }

    return this.apiClient
      .one('person', personId)
      .all('image')
      .get()
      .then(response => response.data.url)
  }

  getActiveCourtCases(personId) {
    if (!personId) {
      return Promise.reject(new Error('No ID supplied'))
    }

    return this.apiClient
      .one('person', personId)
      .all('court_case')
      .get({
        'filter[active]': true,
        include: ['location'],
      })
      .then(response => response.data)
  }

  getTimetableByDate(personId, date) {
    if (!personId) {
      return Promise.reject(new Error('No ID supplied'))
    }

    return this.apiClient
      .one('person', personId)
      .all('timetable_entry')
      .get({
        'filter[date_from]': date,
        'filter[date_to]': date,
        include: ['location'],
      })
      .then(response => response.data)
  }

  getByIdentifiers(identifiers) {
    const filter = {
      ...mapKeys(identifiers, (value, key) => `filter[${key}]`),
      include: ['gender'],
    }

    return this.apiClient
      .findAll('person', filter)
      .then(response => response.data)
  }
}

module.exports = PersonService
