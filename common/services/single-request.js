const { pickBy } = require('lodash')

const moveService = require('./move')

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
    }

    return moveService.getAll({
      isAggregation,
      filter: pickBy({
        ...statusFilter,
        'filter[from_location_id]': fromLocationId,
        'filter[to_location_id]': toLocationId,
        'filter[date_from]': moveDateFrom,
        'filter[date_to]': moveDateTo,
        'filter[created_at_from]': createdAtFrom,
        'filter[created_at_to]': createdAtTo,
        'filter[move_type]': 'prison_transfer',
        'sort[by]': sortBy,
        'sort[direction]': sortDirection,
      }),
    })
  },
}

module.exports = singleRequestService
