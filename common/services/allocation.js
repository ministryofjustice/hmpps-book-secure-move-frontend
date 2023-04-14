const dateFunctions = require('date-fns')
const { mapValues, set } = require('lodash')

const BaseService = require('./base')

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
      if (!result.meta?.moves && result.moves?.length) {
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

  update(data) {
    return this.apiClient
      .update('allocation', this.format(data))
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
    page,
  } = {}) {
    const [moveDateFrom, moveDateTo] = moveDate

    return this.get({
      isAggregation,
      include: ['from_location', 'to_location'],
      page,
      // TODO: This can be removed once move count and progress are returned
      // by the API as resouce meta
      includeCancelled: status ? status.includes('cancelled') : false,
      filter: {
        status,
        from_locations: fromLocations.join(','),
        to_locations: toLocations.join(','),
        locations: locations.join(','),
        date_from: moveDateFrom,
        date_to: moveDateTo,
      },
      sort: {
        by: sortBy,
        direction: sortDirection,
      },
    })
  }

  get({
    filter = {},
    sort = {},
    page = 1,
    perPage = 20,
    includeCancelled = false,
    isAggregation = false,
    include,
  } = {}) {
    return this.apiClient
      .all('allocation')
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
        const { data, meta } = response

        if (isAggregation) {
          return meta.pagination.total_objects
        }

        return {
          ...response,
          data: data.map(AllocationService.transform({ includeCancelled })),
        }
      })
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
