const dateFunctions = require('date-fns')
const { isNil, mapValues, omitBy, pick } = require('lodash')

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
    include,
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
          'filter[status]': 'requested,accepted,booked,in_transit,completed',
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
      include: include || [
        'from_location',
        'to_location',
        'profile.person',
        'prison_transfer_reason',
      ],
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

  getDownload(args) {
    return singleRequestService.getAll({
      ...args,
      include: [
        'from_location',
        'prison_transfer_reason',
        'profile',
        'profile.documents',
        'profile.person',
        'profile.person.ethnicity',
        'profile.person.gender',
        'to_location',
      ],
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

  reject(id, data = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    const booleansAndNulls = ['rebook']
    const fields = ['rejection_reason', 'cancellation_reason_comment', 'rebook']

    const mappedData = mapValues(pick(data, fields), (value, key) => {
      if (booleansAndNulls.includes(key)) {
        try {
          value = JSON.parse(value)
        } catch (e) {}
      }

      return value
    })

    const timestamp = dateFunctions.formatISO(new Date())

    return apiClient
      .one('move', id)
      .all('reject')
      .post({
        timestamp,
        ...mappedData,
      })
      .then(response => response.data)
  },
}

module.exports = singleRequestService
