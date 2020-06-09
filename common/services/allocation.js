const dateFunctions = require('date-fns')
const { mapValues, pickBy } = require('lodash')

const apiClient = require('../lib/api-client')()
const personService = require('../services/person')

const allocationService = {
  cancel(allocationId) {
    const timestamp = dateFunctions.formatISO(new Date())
    return apiClient
      .one('allocation', allocationId)
      .all('event')
      .post({
        event_name: 'cancel',
        timestamp,
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
          .map(move => ({
            ...move,
            person: personService.transform(move.person),
          })),
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
    fromLocationId,
    toLocationId,
    includeCancelled = false,
    isAggregation = false,
    status,
    sortBy,
    sortDirection,
  } = {}) {
    const [moveDateFrom, moveDateTo] = moveDate

    return allocationService.getAll({
      isAggregation,
      includeCancelled,
      filter: pickBy({
        'filter[status]': status,
        'filter[from_locations]': fromLocationId,
        'filter[to_locations]': toLocationId,
        'filter[date_from]': moveDateFrom,
        'filter[date_to]': moveDateTo,
        'sort[by]': sortBy,
        'sort[direction]': sortDirection,
      }),
    })
  },
  getActive(args) {
    return allocationService.getByDateAndLocation({
      ...args,
      status: args.status || 'filled,unfilled',
    })
  },
  getCancelled(args) {
    return allocationService.getByDateAndLocation({
      ...args,
      includeCancelled: true,
      status: 'cancelled',
    })
  },
  getAll({
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
        include,
      })
      .then(response => {
        const { data, links, meta } = response
        const results = [...combinedData, ...data]

        if (isAggregation) {
          return meta.pagination.total_objects
        }

        if (!links.next) {
          return results.map(allocationService.transform({ includeCancelled }))
        }

        return allocationService.getAll({
          filter,
          combinedData: results,
          page: page + 1,
          include,
        })
      })
  },
  getById(id, { include } = {}) {
    return apiClient
      .find('allocation', id, { include })
      .then(response => response.data)
      .then(allocationService.transform())
  },
}

module.exports = allocationService
