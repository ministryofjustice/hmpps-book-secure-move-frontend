const dateFunctions = require('date-fns')
const { mapValues, pickBy } = require('lodash')

const apiClient = require('../lib/api-client')()
const personService = require('../services/person')

const noMoveIdMessage = 'No move ID supplied'
const moveService = {
  format(data) {
    const booleansAndNulls = ['move_agreed']
    const relationships = [
      'to_location',
      'from_location',
      'person',
      'prison_transfer_reason',
    ]

    return mapValues(pickBy(data), (value, key) => {
      if (booleansAndNulls.includes(key)) {
        try {
          value = JSON.parse(value)
        } catch (e) {}
      }
      if (relationships.includes(key) && typeof value === 'string') {
        return { id: value }
      }
      return value
    })
  },

  getAll({
    filter = {},
    combinedData = [],
    page = 1,
    isAggregation = false,
  } = {}) {
    return apiClient
      .findAll('move', {
        ...filter,
        page,
        per_page: isAggregation ? 1 : 100,
      })
      .then(response => {
        const { data, links, meta } = response
        const moves = [...combinedData, ...data]

        if (isAggregation) {
          return meta.pagination.total_objects
        }

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

  getMovesByDateRangeAndStatus({
    dateRange = [],
    status,
    fromLocationId,
  } = {}) {
    const [createdAtFrom, createdAtTo] = dateRange
    return moveService.getAll({
      filter: {
        'filter[status]': status,
        'filter[created_at_from]': createdAtFrom,
        'filter[created_at_to]': createdAtTo,
        'filter[from_location_id]': fromLocationId,
        'sort[by]': 'created_at',
        'sort[direction]': 'desc',
      },
    })
  },

  getMovesCount({ dateRange = [], status, locationId } = {}) {
    const [createdAtFrom, createdAtTo] = dateRange
    const filter = {
      'filter[status]': status,
      'filter[created_at_from]': createdAtFrom,
      'filter[created_at_to]': createdAtTo,
      'filter[from_location_id]': locationId,
    }
    return apiClient
      .findAll('move', {
        ...filter,
        page: 1,
        per_page: 1,
      })
      .then(response => response.meta.pagination.total_objects)
  },

  getRequested({ dateRange = [], fromLocationId, toLocationId } = {}) {
    const [startDate, endDate] = dateRange
    return moveService.getAll({
      filter: {
        'filter[status]': 'requested',
        'filter[date_from]': startDate,
        'filter[date_to]': endDate,
        'filter[from_location_id]': fromLocationId,
        'filter[to_location_id]': toLocationId,
      },
    })
  },

  getActive({ dateRange = [], fromLocationId, toLocationId } = {}) {
    const [startDate, endDate] = dateRange
    return moveService.getAll({
      filter: {
        'filter[status]': 'requested,accepted,completed',
        'filter[date_from]': startDate,
        'filter[date_to]': endDate,
        'filter[from_location_id]': fromLocationId,
        'filter[to_location_id]': toLocationId,
      },
    })
  },

  getCancelled({ dateRange = [], fromLocationId, toLocationId } = {}) {
    const [startDate, endDate] = dateRange
    return moveService.getAll({
      filter: {
        'filter[status]': 'cancelled',
        'filter[date_from]': startDate,
        'filter[date_to]': endDate,
        'filter[from_location_id]': fromLocationId,
        'filter[to_location_id]': toLocationId,
      },
    })
  },

  getById(id) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
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

  update(data) {
    if (!data.id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return apiClient
      .update('move', moveService.format(data))
      .then(response => response.data)
      .then(move => ({
        ...move,
        person: personService.transform(move.person),
      }))
  },

  redirect(data) {
    if (!data.id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }
    const timestamp = dateFunctions.formatISO(new Date())
    return apiClient
      .one('move', data.id)
      .all('event')
      .post({
        event_name: 'redirect',
        timestamp,
        ...data,
      })
  },

  cancel(id, { reason, comment } = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
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
