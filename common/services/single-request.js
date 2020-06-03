const { isNil, omitBy } = require('lodash')

const apiClient = require('../lib/api-client')()

const moveService = require('./move')

const noMoveIdMessage = 'No move ID supplied'
const singleRequestService = {
  approve(id, { date } = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return apiClient
      .update('move', {
        date,
        id,
        status: 'requested',
      })
      .then(response => response.data)
  },

  getAll({
    status,
    moveDate = [],
    createdAtDate = [],
    fromLocationId,
    toLocationId,
    isAggregation = false,
    sortBy = 'created_at',
    sortDirection = 'desc',
  } = {}) {
    const [moveDateFrom, moveDateTo] = moveDate
    const [createdAtFrom, createdAtTo] = createdAtDate

    let statusFilter
    switch (status) {
      case 'pending':
        statusFilter = {
          'filter[status]': 'proposed',
        }
        break
      case 'approved':
        statusFilter = {
          'filter[status]': 'requested,accepted,completed',
        }
        break
      case 'rejected':
        statusFilter = {
          'filter[cancellation_reason]': 'rejected',
          'filter[status]': 'cancelled',
        }
        break
      default:
        statusFilter = {
          'filter[status]': status,
        }
    }

    return moveService.getAll({
      filter: omitBy(
        {
          ...statusFilter,
          'filter[created_at_from]': createdAtFrom,
          'filter[created_at_to]': createdAtTo,
          'filter[date_from]': moveDateFrom,
          'filter[date_to]': moveDateTo,
          'filter[from_location_id]': fromLocationId,
          'filter[has_relationship_to_allocation]': false,
          'filter[move_type]': 'prison_transfer',
          'filter[to_location_id]': toLocationId,
          'sort[by]': sortBy,
          'sort[direction]': sortDirection,
        },
        isNil
      ),
      isAggregation,
    })
  },

  reject(id, { comment } = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return apiClient
      .update('move', {
        cancellation_reason: 'rejected',
        cancellation_reason_comment: comment,
        id,
        status: 'cancelled',
      })
      .then(response => response.data)
  },
}

module.exports = singleRequestService
