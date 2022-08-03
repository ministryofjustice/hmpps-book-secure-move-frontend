const dateFunctions = require('date-fns')
const { mapValues, pick } = require('lodash')

const BaseService = require('./base')
const MoveService = require('./move')

const noMoveIdMessage = 'No move ID supplied'
class SingleRequestService extends BaseService {
  constructor(req) {
    super(req)
    this.moveService =
      (this.req && this.req.services && this.req.services.move) ||
      new MoveService(this.req)
  }

  getAll({
    status,
    moveDate = [],
    createdAtDate = [],
    fromLocationId = [],
    toLocationId = [],
    dateOfBirthFrom,
    dateOfBirthTo,
    include,
    isAggregation = false,
    page,
    sortBy = 'created_at',
    sortDirection = 'desc',
  } = {}) {
    const [moveDateFrom, moveDateTo] = moveDate
    const [createdAtFrom, createdAtTo] = createdAtDate

    let statusFilter

    switch (status) {
      case 'pending':
        statusFilter = {
          status: 'proposed',
        }
        break
      case 'approved':
        statusFilter = {
          status: 'requested,accepted,booked,in_transit,completed',
        }
        break
      case 'rejected':
        statusFilter = {
          status: 'cancelled',
          cancellation_reason: 'rejected',
        }
        break
      case 'cancelled':
        statusFilter = {
          status: 'cancelled',
          // TODO: Find a better filter for this. Currently we will need to add any new reasons from the API here.
          cancellation_reason:
            'made_in_error,supplier_declined_to_move,cancelled_by_pmu,other',
        }
        break
      default:
        statusFilter = {
          status,
        }
    }

    return this.moveService.get({
      isAggregation,
      include: include || [
        'from_location',
        'to_location',
        'profile.person',
        'prison_transfer_reason',
      ],
      filter: {
        ...statusFilter,
        has_relationship_to_allocation: 'false',
        from_location_id: fromLocationId.join(','),
        to_location_id: toLocationId.join(','),
        date_from: moveDateFrom,
        date_to: moveDateTo,
        date_of_birth_from: dateOfBirthFrom,
        date_of_birth_to: dateOfBirthTo,
        created_at_from: createdAtFrom,
        created_at_to: createdAtTo,
        move_type: 'prison_transfer',
      },
      sort: {
        by: sortBy,
        direction: sortDirection,
      },
      page,
    })
  }

  getDownload(req, args) {
    return this.moveService.getDownload(req, args)
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
