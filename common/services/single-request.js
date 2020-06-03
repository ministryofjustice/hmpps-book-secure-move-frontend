const { isNil, omitBy } = require('lodash')

const apiClient = require('../lib/api-client')()

const moveService = require('./move')

const noMoveIdMessage = 'No move ID supplied'
const singleRequestService = {
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
          'filter[status]': 'cancelled',
          'filter[cancellation_reason]': 'rejected',
        }
        break
      default:
        statusFilter = {
          'filter[status]': status,
        }
    }

    return moveService.getAll({
      isAggregation,
      filter: omitBy(
        {
          ...statusFilter,
          'filter[has_relationship_to_allocation]': false,
          'filter[from_location_id]': fromLocationId,
          'filter[to_location_id]': toLocationId,
          'filter[date_from]': moveDateFrom,
          'filter[date_to]': moveDateTo,
          'filter[created_at_from]': createdAtFrom,
          'filter[created_at_to]': createdAtTo,
          'filter[move_type]': 'prison_transfer',
          'sort[by]': sortBy,
          'sort[direction]': sortDirection,
        },
        isNil
      ),
    })
  },

  approve(id, { date } = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return apiClient
      .update('move', {
        id,
        date,
        status: 'requested',
      })
      .then(response => response.data)
  },

  reject(id, { comment } = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return apiClient
      .update('move', {
        id,
        status: 'cancelled',
        cancellation_reason: 'rejected',
        cancellation_reason_comment: comment,
      })
      .then(response => response.data)
  },
}

module.exports = singleRequestService
