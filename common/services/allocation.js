const dateFunctions = require('date-fns')
const { mapValues, pickBy } = require('lodash')

const ApiClient = require('../lib/api-client')

const batchRequest = require('./batch-request')
const MoveService = require('./move')

const addRequestContext = req => {
  const apiClient = ApiClient(req)
  const moveService = MoveService.addRequestContext(req)

  function getAll({
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
          return results.map(allocationService.transform({ includeCancelled }))
        }

        return allocationService.getAll({
          filter,
          combinedData: results,
          page: page + 1,
          include,
        })
      })
  }

  const allocationService = {
    cancel(id, { reason, comment } = {}) {
      if (!id) {
        return Promise.reject(new Error('No allocation id supplied'))
      }

      const timestamp = dateFunctions.formatISO(new Date())

      return apiClient
        .one('allocation', id)
        .all('cancel')
        .post({
          timestamp,
          cancellation_reason: reason,
          cancellation_reason_comment: comment,
        })
        .then(response => response.data)
    },

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
    },
    transform({ includeCancelled = false } = {}) {
      return function transformAllocation(result) {
        return {
          ...result,
          moves: result.moves
            .filter(
              move => includeCancelled || !['cancelled'].includes(move.status)
            )
            .map(moveService.transform),
        }
      }
    },
    create(data) {
      return apiClient
        .create('allocation', allocationService.format(data))
        .then(response => response.data)
        .then(allocationService.transform())
    },
    getByDateAndLocation({
      moveDate = [],
      fromLocations = [],
      toLocations = [],
      locations = [],
      include = ['from_location', 'moves', 'moves.profile', 'to_location'],
      isAggregation = false,
      status,
      sortBy,
      sortDirection,
    } = {}) {
      const [moveDateFrom, moveDateTo] = moveDate

      return allocationService.getAll({
        isAggregation,
        include,
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
    },
    getAll(props) {
      return batchRequest(getAll, props, [
        'from_locations',
        'to_locations',
        'locations',
      ])
    },
    getById(id, { include } = {}) {
      return apiClient
        .find('allocation', id, { include })
        .then(response => response.data)
        .then(allocationService.transform())
    },
  }

  return allocationService
}

const allocationService = addRequestContext()
allocationService.addRequestContext = addRequestContext

module.exports = allocationService
