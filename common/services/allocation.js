const dateFunctions = require('date-fns')
const { mapValues, pickBy, set } = require('lodash')

const BaseService = require('./base')
const batchRequest = require('./batch-request')

function getAll({
  apiClient,
  filter = {},
  combinedData = [],
  page = 1,
  includeCancelled = false,
  isAggregation = false,
  include,
} = {}) {
  return apiClient
    .findAll('allocation', {
      ...filter,
      page,
      per_page: isAggregation ? 1 : 100,
      include: isAggregation ? [] : include,
    })
    .then(response => {
      const { data, links, meta } = response
      const results = [...combinedData, ...data]

      if (isAggregation) {
        return meta.pagination.total_objects
      }

      const hasNext = links.next && data.length !== 0

      if (!hasNext) {
        return results.map(AllocationService.transform({ includeCancelled }))
      }

      return getAll({
        apiClient,
        filter,
        combinedData: results,
        page: page + 1,
        include,
      })
    })
}

class AllocationService extends BaseService {
  cancel(id, { reason, comment } = {}) {
    if (!id) {
      return Promise.reject(new Error('No allocation id supplied'))
    }

    const timestamp = dateFunctions.formatISO(new Date())

    return this.apiClient
      .one('allocation', id)
      .all('cancel')
      .post({
        timestamp,
        cancellation_reason: reason,
        cancellation_reason_comment: comment,
      })
      .then(response => response.data)
  }

  format(data) {
    const booleansAndNulls = ['complete_in_full', 'sentence_length']
    const relationships = ['to_location', 'from_location']

    return mapValues(data, (value, key) => {
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

  static transform({ includeCancelled = false } = {}) {
    return function transformAllocation(result) {
      // TODO: Remove when individual allocations return meta.moves info
      // TODO: see moves filtering below too
      if (!result.meta?.moves && result.moves.length) {
        set(result, 'meta.moves.total', result.moves.length)

        if (result.status !== 'cancelled') {
          result.moves = result.moves.filter(
            move => move.status !== 'cancelled'
          )
          set(result, 'meta.moves.total', result.moves.length)
        }
      }
      // TODO: end

      const {
        total: totalSlots,
        filled: filledSlots,
        unfilled: unfilledSlots,
      } = result.meta?.moves || {}

      result = { ...result }
      delete result.meta

      // ensure that moves is not empty before attempting to transform them
      // why? because the BE does not return moves for multiple allocations
      result.moves = result.moves || []

      // TODO: Remove includeCancelled malarkey when meta.moves info available
      return {
        ...result,
        totalSlots,
        filledSlots,
        unfilledSlots,
        moves: result.moves.filter(
          move => includeCancelled || !['cancelled'].includes(move.status)
        ),
      }
    }
  }

  create(data) {
    return this.apiClient
      .create('allocation', this.format(data))
      .then(response => response.data)
      .then(AllocationService.transform())
  }

  getByDateAndLocation({
    moveDate = [],
    fromLocations = [],
    toLocations = [],
    locations = [],
    isAggregation = false,
    status,
    sortBy,
    sortDirection,
  } = {}) {
    const [moveDateFrom, moveDateTo] = moveDate

    return this.getAll({
      isAggregation,
      include: ['from_location', 'to_location'],
      // TODO: This can be removed once move count and progress are returned
      // by the API as resouce meta
      includeCancelled: status ? status.includes('cancelled') : false,
      filter: pickBy({
        'filter[status]': status,
        'filter[from_locations]': fromLocations.join(','),
        'filter[to_locations]': toLocations.join(','),
        'filter[locations]': locations.join(','),
        'filter[date_from]': moveDateFrom,
        'filter[date_to]': moveDateTo,
        'sort[by]': sortBy,
        'sort[direction]': sortDirection,
      }),
    })
  }

  getAll(props) {
    return batchRequest(getAll, { ...props, apiClient: this.apiClient }, [
      'from_locations',
      'to_locations',
      'locations',
    ])
  }

  getById(id) {
    const include = [
      'from_location',
      'moves',
      'moves.profile',
      'moves.profile.person',
      'moves.profile.person.ethnicity',
      'moves.profile.person.gender',
      'to_location',
    ]

    return this.apiClient
      .find('allocation', id, { include })
      .then(response => response.data)
      .then(AllocationService.transform())
  }
}

module.exports = AllocationService
