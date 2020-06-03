const dateFunctions = require('date-fns')
const { mapValues, pickBy } = require('lodash')

const apiClient = require('../lib/api-client')()
const personService = require('../services/person')

const noMoveIdMessage = 'No move ID supplied'
const moveService = {
  cancel(id, { reason, comment } = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return apiClient
      .update('move', {
        cancellation_reason: reason,
        cancellation_reason_comment: comment,
        id,
        status: 'cancelled',
      })
      .then(response => response.data)
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

  getActive({ dateRange = [], fromLocationId, toLocationId } = {}) {
    const [startDate, endDate] = dateRange
    return moveService.getAll({
      filter: {
        'filter[date_from]': startDate,
        'filter[date_to]': endDate,
        'filter[from_location_id]': fromLocationId,
        'filter[status]': 'requested,accepted,completed',
        'filter[to_location_id]': toLocationId,
      },
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
          combinedData: moves,
          filter,
          page: page + 1,
        })
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

  getCancelled({ dateRange = [], fromLocationId, toLocationId } = {}) {
    const [startDate, endDate] = dateRange
    return moveService.getAll({
      filter: {
        'filter[date_from]': startDate,
        'filter[date_to]': endDate,
        'filter[from_location_id]': fromLocationId,
        'filter[status]': 'cancelled',
        'filter[to_location_id]': toLocationId,
      },
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
        'filter[created_at_from]': createdAtFrom,
        'filter[created_at_to]': createdAtTo,
        'filter[from_location_id]': fromLocationId,
        'filter[status]': status,
        'sort[by]': 'created_at',
        'sort[direction]': 'desc',
      },
    })
  },

  getMovesCount({ dateRange = [], status, locationId } = {}) {
    const [createdAtFrom, createdAtTo] = dateRange
    const filter = {
      'filter[created_at_from]': createdAtFrom,
      'filter[created_at_to]': createdAtTo,
      'filter[from_location_id]': locationId,
      'filter[status]': status,
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
        'filter[date_from]': startDate,
        'filter[date_to]': endDate,
        'filter[from_location_id]': fromLocationId,
        'filter[status]': 'requested',
        'filter[to_location_id]': toLocationId,
      },
    })
  },

  redirect(data) {
    if (!data.id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }
    const timestamp = dateFunctions.formatISO(new Date())
    return apiClient
      .one('move', data.id)
      .all('redirect')
      .post({
        timestamp,
        ...data,
      })
  },

  unassign(id) {
    return moveService.update({
      id,
      move_agreed: false,
      move_agreed_by: '',
      person: {
        id: null,
      },
    })
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
}

module.exports = moveService
