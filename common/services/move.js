const { mapValues, pickBy } = require('lodash')

const apiClient = require('../lib/api-client')()
const personService = require('../services/person')

const moveService = {
  format(data) {
    const relationships = ['to_location', 'from_location']

    return mapValues(pickBy(data), (value, key) => {
      if (relationships.includes(key) && typeof value === 'string') {
        return { id: value }
      }
      return value
    })
  },

  getAll({ filter, combinedData = [], page = 1 } = {}) {
    return apiClient
      .findAll('move', {
        ...filter,
        page,
        per_page: 100,
      })
      .then(response => {
        const { data, links } = response
        const moves = [...combinedData, ...data]

        if (!links.next) {
          return moves.map(move => ({
            ...move,
            person: personService.transform(move.person),
          }))
        }

        return moveService.getAll({
          filter,
          combinedData: moves,
          page: page + 1,
        })
      })
  },

  getRequested({ moveDate, fromLocationId, toLocationId } = {}) {
    return moveService.getAll({
      filter: {
        'filter[status]': 'requested',
        'filter[date_from]': moveDate,
        'filter[date_to]': moveDate,
        'filter[from_location_id]': fromLocationId,
        'filter[to_location_id]': toLocationId,
      },
    })
  },

  getCancelled({ moveDate, fromLocationId, toLocationId } = {}) {
    return moveService.getAll({
      filter: {
        'filter[status]': 'cancelled',
        'filter[date_from]': moveDate,
        'filter[date_to]': moveDate,
        'filter[from_location_id]': fromLocationId,
        'filter[to_location_id]': toLocationId,
      },
    })
  },

  getById(id) {
    if (!id) {
      return Promise.reject(new Error('No move ID supplied'))
    }

    return apiClient
      .find('move', id)
      .then(response => response.data)
      .then(move => ({
        ...move,
        person: personService.transform(move.person),
      }))
  },

  create(data) {
    return apiClient
      .create('move', moveService.format(data))
      .then(response => response.data)
      .then(move => ({
        ...move,
        person: personService.transform(move.person),
      }))
  },

  cancel(id, { reason, comment } = {}) {
    if (!id) {
      return Promise.reject(new Error('No move ID supplied'))
    }

    return apiClient
      .update('move', {
        id,
        status: 'cancelled',
        cancellation_reason: reason,
        cancellation_reason_comment: comment,
      })
      .then(response => response.data)
  },
}

module.exports = moveService
