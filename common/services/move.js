const dateFunctions = require('date-fns')
const { mapValues, omitBy, pickBy, isUndefined, isEmpty } = require('lodash')

const canCancelMove = require('../helpers/move/can-cancel-move')
const canEditMove = require('../helpers/move/can-edit-move')
const restClient = require('../lib/api-client/rest-client')

const BaseService = require('./base')

const defaultInclude = [
  'allocation',
  'court_hearings',
  'from_location',
  'from_location.suppliers',
  'prison_transfer_reason',
  'profile',
  'profile.documents',
  'profile.person',
  'profile.person.ethnicity',
  'profile.person.gender',
  'profile.person_escort_record',
  'profile.person_escort_record.flags',
  'profile.person_escort_record.framework',
  'profile.person_escort_record.prefill_source',
  'profile.person_escort_record.responses',
  'profile.person_escort_record.responses.nomis_mappings',
  'profile.person_escort_record.responses.question',
  'profile.person_escort_record.responses.question.descendants.**',
  'profile.youth_risk_assessment',
  'profile.youth_risk_assessment.flags',
  'profile.youth_risk_assessment.framework',
  'profile.youth_risk_assessment.prefill_source',
  'profile.youth_risk_assessment.responses',
  'profile.youth_risk_assessment.responses.nomis_mappings',
  'profile.youth_risk_assessment.responses.question',
  'profile.youth_risk_assessment.responses.question.descendants.**',
  'supplier',
  'to_location',
]
const noMoveIdMessage = 'No move ID supplied'

class MoveService extends BaseService {
  defaultInclude() {
    return defaultInclude
  }

  format(data) {
    const booleansAndNulls = ['move_agreed']
    const relationships = [
      'from_location',
      'person',
      'prison_transfer_reason',
      'supplier',
      'to_location',
    ]

    // We have to pretend that 'secure_childrens_home', 'secure_training_centre' are valid `move_type`s
    const youthTransfer = ['secure_childrens_home', 'secure_training_centre']

    if (youthTransfer.includes(data.move_type)) {
      data.move_type = 'prison_transfer'
    }

    return mapValues(omitBy(data, isUndefined), (value, key) => {
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
  }

  get({
    filter = {},
    sort = {},
    page = 1,
    perPage = 20,
    isAggregation = false,
    include,
  } = {}) {
    return this.apiClient
      .all('move')
      .all('filtered')
      .post(
        {
          filter: this.removeInvalid(filter),
        },
        this.removeInvalid({
          include: isAggregation ? [] : include,
          page: isAggregation ? 1 : page,
          per_page: isAggregation ? 1 : perPage,
          'sort[by]': sort.by,
          'sort[direction]': sort.direction,
        })
      )
      .then(response => {
        if (isAggregation) {
          return response.meta.pagination.total_objects
        }

        return response
      })
  }

  getAll({
    filter = {},
    params = {},
    combinedData = [],
    page = 1,
    isAggregation = false,
    include,
    sort = {},
  } = {}) {
    return this.apiClient
      .all('move')
      .all('filtered')
      .post(
        {
          filter: this.removeInvalid(filter),
        },
        this.removeInvalid({
          ...params,
          include: isAggregation ? [] : include,
          page: isAggregation ? 1 : page,
          per_page: isAggregation ? 1 : 100,
          'sort[by]': sort.by,
          'sort[direction]': sort.direction,
        })
      )
      .then(response => {
        const { data, links, meta } = response
        const moves = [...combinedData, ...data]

        if (isAggregation) {
          return meta.pagination.total_objects
        }

        const hasNext = links.next && data.length !== 0

        if (!hasNext) {
          return moves
        }

        return this.getAll({
          filter,
          sort,
          combinedData: moves,
          page: page + 1,
          params,
          include,
        })
      })
  }

  getActive({
    dateRange = [],
    fromLocationId = [],
    toLocationId = [],
    supplierId,
    status,
    isAggregation = false,
  } = {}) {
    const [startDate, endDate] = dateRange
    let statusFilter

    switch (status) {
      case 'active':
        statusFilter = {
          status: 'requested,accepted,booked,in_transit,completed',
        }
        break
      case 'incomplete':
        statusFilter = {
          status: 'requested,accepted,booked',
          ready_for_transit: 'false',
        }
        break
      case 'awaiting_collection':
        statusFilter = {
          status: 'requested,accepted,booked',
        }
        break
      case 'ready_for_transit':
        statusFilter = {
          status: 'requested,accepted,booked',
          ready_for_transit: 'true',
        }
        break
      case 'left_custody':
        statusFilter = {
          status: 'in_transit,completed',
        }
        break
      case 'cancelled':
        statusFilter = {
          status: 'cancelled',
        }
        break
      default:
        statusFilter = {
          status,
        }
    }

    return this.getAll({
      isAggregation,
      include: [
        'from_location',
        'important_events',
        'profile',
        'profile.person',
        'profile.person.gender',
        'profile.person_escort_record.flags',
        'to_location',
      ],
      params: {
        meta: 'vehicle_registration,expected_time_of_arrival,expected_collection_time',
      },
      filter: {
        ...statusFilter,
        date_from: startDate,
        date_to: endDate,
        from_location_id: fromLocationId.join(','),
        to_location_id: toLocationId.join(','),
        supplier_id: supplierId,
      },
    })
  }

  async getDownload(
    req,
    {
      status = 'requested,accepted,booked,in_transit,completed,cancelled',
      dateRange = [],
      createdAtDate = [],
      fromLocationId,
      toLocationId,
      supplierId = undefined,
      dateOfBirthFrom,
      dateOfBirthTo,
    } = {}
  ) {
    const [startDate, endDate] = dateRange
    const [createdAtFrom, createdAtTo] = createdAtDate
    const filter = omitBy(
      {
        status,
        date_from: startDate,
        date_to: endDate,
        created_at_from: createdAtFrom,
        created_at_to: createdAtTo,
        from_location_id: Array.isArray(fromLocationId)
          ? fromLocationId.join(',')
          : fromLocationId,
        to_location_id: Array.isArray(toLocationId)
          ? toLocationId.join(',')
          : toLocationId,
        supplier_id: supplierId,
        date_of_birth_from: dateOfBirthFrom,
        date_of_birth_to: dateOfBirthTo,
      },
      isEmpty
    )

    const response = await restClient.post(
      req,
      '/moves/csv',
      { filter },
      {
        format: 'text/csv',
      }
    )
    return response
  }

  _getById(id, options = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    const { canAccess } = this.req

    return this.apiClient.find('move', id, options).then(response => {
      const move = response.data

      return {
        ...move,
        _canCancel: canCancelMove(move, canAccess),
        _canEdit: canEditMove(move, canAccess),
      }
    })
  }

  getById(id) {
    return this._getById(id, {
      include: [
        ...this.defaultInclude(),
        'important_events',
        'profile.category',
      ],
    })
  }

  getByIdWithEvents(id) {
    const include = [
      ...this.defaultInclude(),
      'timeline_events',
      'timeline_events.eventable',
      'timeline_events.location',
      'timeline_events.court_location',
      'timeline_events.from_location',
      'timeline_events.to_location',
      'journeys.to_location',
      'journeys.from_location',
    ]

    return this._getById(id, { include })
  }

  create(data, { include } = {}) {
    return this.apiClient
      .create('move', this.format(data), { include })
      .then(response => response.data)
  }

  update(data) {
    if (!data.id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return this.apiClient
      .update('move', this.format(data))
      .then(response => response.data)
  }

  redirect(data) {
    if (!data.id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    const timestamp = dateFunctions.formatISO(new Date())
    return this.apiClient
      .one('move', data.id)
      .all('redirect')
      .post({
        timestamp,
        ...data,
      })
  }

  accept(id) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    const timestamp = dateFunctions.formatISO(new Date())

    return this.apiClient.one('move', id).all('accept').post({
      timestamp,
    })
  }

  complete(id, { notes } = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    const timestamp = dateFunctions.formatISO(new Date())

    return this.apiClient.one('move', id).all('complete').post(
      pickBy({
        timestamp,
        notes,
      })
    )
  }

  start(id) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    const timestamp = dateFunctions.formatISO(new Date())

    return this.apiClient.one('move', id).all('start').post({
      timestamp,
    })
  }

  unassign(id) {
    return this.update({
      id,
      profile: {
        id: null,
      },
      move_agreed: null,
      move_agreed_by: null,
    })
  }

  cancel(id, { reason, comment } = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    const timestamp = dateFunctions.formatISO(new Date())

    return this.apiClient
      .one('move', id)
      .all('cancel')
      .post({
        timestamp,
        cancellation_reason: reason,
        cancellation_reason_comment: comment,
      })
      .then(response => response.data)
  }
}

module.exports = MoveService
