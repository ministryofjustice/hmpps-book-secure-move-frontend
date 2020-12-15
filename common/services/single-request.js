const dateFunctions = require('date-fns')
const { isNil, isUndefined, mapValues, omitBy, pick } = require('lodash')

const BaseService = require('./base')
const moveService = require('./move')

const noMoveIdMessage = 'No move ID supplied'
class SingleRequestService extends BaseService {
  getAll({
    status,
    moveDate = [],
    createdAtDate = [],
    fromLocationId,
    toLocationId,
    dateOfBirthFrom,
    dateOfBirthTo,
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
      case 'cancelled':
        statusFilter = {
          'filter[status]': 'cancelled',
          // TODO: Find a better filter for this. Currently we will need to add any new reasons from the API here.
          'filter[cancellation_reason]':
            'made_in_error,supplier_declined_to_move,cancelled_by_pmu,other',
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
          'filter[date_of_birth_from]': dateOfBirthFrom,
          'filter[date_of_birth_to]': dateOfBirthTo,
          'filter[created_at_from]': createdAtFrom,
          'filter[created_at_to]': createdAtTo,
          'filter[move_type]': 'prison_transfer',
          'sort[by]': sortBy,
          'sort[direction]': sortDirection,
        },
        isNil
      ),
    })
  }

  async getDownload(args) {
    return moveService.getDownload(args)
  }

  getCancelled({
    moveDate = [],
    createdAtDate = [],
    fromLocationId,
    include,
    sortBy = 'created_at',
    sortDirection = 'desc',
  } = {}) {
    const [moveDateFrom, moveDateTo] = moveDate
    const [createdAtFrom, createdAtTo] = createdAtDate
    const dateRanges = omitBy(
      {
        'filter[date_from]': moveDateFrom,
        'filter[date_to]': moveDateTo,
        'filter[created_at_from]': createdAtFrom,
        'filter[created_at_to]': createdAtTo,
      },
      isUndefined
    )

    return moveService.getAll({
      isAggregation: false,
      include: include || [
        'from_location',
        'to_location',
        'profile.person',
        'prison_transfer_reason',
      ],
      filter: {
        'filter[has_relationship_to_allocation]': false,
        'filter[from_location_id]': fromLocationId,
        'filter[status]': 'cancelled',
        'filter[allocation]': false,
        'filter[move_type]': 'prison_transfer',
        'filter[rejection_reason]': undefined,
        'sort[by]': sortBy,
        'sort[direction]': sortDirection,
        ...dateRanges,
      },
    })
  }

  approve(id, { date } = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    const timestamp = dateFunctions.formatISO(new Date())

    return this.apiClient
      .one('move', id)
      .all('approve')
      .post({
        timestamp,
        date,
      })
      .then(response => response.data)
  }

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

    return this.apiClient
      .one('move', id)
      .all('reject')
      .post({
        timestamp,
        ...mappedData,
      })
      .then(response => response.data)
  }
}

module.exports = SingleRequestService
