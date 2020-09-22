const dateFunctions = require('date-fns')
const { mapValues, omitBy, isUndefined, isEmpty, get } = require('lodash')

const apiClient = require('../lib/api-client')()
const restClient = require('../lib/api-client/rest-client')
const personService = require('../services/person')
const profileService = require('../services/profile')

const batchRequest = require('./batch-request')

function getAll({
  filter = {},
  combinedData = [],
  page = 1,
  isAggregation = false,
  include,
} = {}) {
  return apiClient
    .findAll('move', {
      ...filter,
      include: isAggregation ? [] : include,
      page,
      per_page: isAggregation ? 1 : 100,
    })
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

      return getAll({
        filter,
        combinedData: moves,
        page: page + 1,
        include,
      })
    })
}

const noMoveIdMessage = 'No move ID supplied'
const moveService = {
  transform(move) {
    // We have to pretend that 'secure_childrens_home', 'secure_training_centre' are valid `move_type`s
    const youthTransfer = ['secure_childrens_home', 'secure_training_centre']
    const locationType = get(move, 'to_location.location_type')

    if (youthTransfer.includes(locationType)) {
      move.move_type = locationType
    }

    return {
      ...move,
      profile: profileService.transform(move.profile),
      person: personService.transform(move.person),
    }
  },
  format(data) {
    const booleansAndNulls = ['move_agreed']
    const relationships = [
      'to_location',
      'from_location',
      'person',
      'prison_transfer_reason',
      'supplier',
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
  },

  async getAll(props = {}) {
    const results = await batchRequest(getAll, props, [
      'from_location_id',
      'to_location_id',
    ])

    if (props.isAggregation) {
      return results
    }

    return results.map(this.transform)
  },

  getActive({
    dateRange = [],
    fromLocationId,
    toLocationId,
    supplierId,
    isAggregation = false,
  } = {}) {
    const [startDate, endDate] = dateRange
    return moveService.getAll({
      isAggregation,
      include: [
        'profile',
        'profile.person_escort_record.flags',
        'profile.person',
        'profile.person.gender',
        'to_location',
      ],
      filter: omitBy(
        {
          'filter[status]': 'requested,accepted,booked,in_transit,completed',
          'filter[date_from]': startDate,
          'filter[date_to]': endDate,
          'filter[from_location_id]': fromLocationId,
          'filter[to_location_id]': toLocationId,
          'filter[supplier_id]': supplierId,
        },
        isEmpty
      ),
    })
  },

  getCancelled({
    dateRange = [],
    fromLocationId,
    toLocationId,
    supplierId,
    isAggregation = false,
  } = {}) {
    const [startDate, endDate] = dateRange
    return moveService.getAll({
      isAggregation,
      include: ['profile.person'],
      filter: omitBy(
        {
          'filter[status]': 'cancelled',
          'filter[date_from]': startDate,
          'filter[date_to]': endDate,
          'filter[from_location_id]': fromLocationId,
          'filter[to_location_id]': toLocationId,
          'filter[supplier_id]': supplierId,
        },
        isEmpty
      ),
    })
  },

  async getDownload({
    status = 'requested,accepted,booked,in_transit,completed,cancelled',
    dateRange = [],
    createdAtDate = [],
    fromLocationId,
    toLocationId,
    supplierId = undefined,
    dateOfBirthFrom,
    dateOfBirthTo,
  } = {}) {
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
      '/moves/csv',
      { filter },
      {
        format: 'text/csv',
      }
    )
    return response
  },

  getById(id, { include } = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return apiClient
      .find('move', id, { include })
      .then(response => response.data)
      .then(this.transform)
  },

  create(data) {
    return apiClient
      .create('move', moveService.format(data))
      .then(response => response.data)
      .then(this.transform)
  },

  update(data) {
    if (!data.id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return apiClient
      .update('move', moveService.format(data))
      .then(response => response.data)
      .then(this.transform)
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
      profile: {
        id: null,
      },
      move_agreed: null,
      move_agreed_by: null,
    })
  },

  cancel(id, { reason, comment } = {}) {
    if (!id) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    const timestamp = dateFunctions.formatISO(new Date())

    return apiClient.one('move', id).all('cancel').post({
      timestamp,
      cancellation_reason: reason,
      cancellation_reason_comment: comment,
    })
  },
}

module.exports = moveService
