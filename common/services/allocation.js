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
  create(data) {
    return apiClient
      .create('allocation', allocationService.format(data))
      .then(response => response.data)
      .then(allocationService.transform())
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
  getActiveAllocations(args) {
    return allocationService.getByDateAndLocation({
      ...args,
      status: 'filled,unfilled',
    })
  },
  getAll({
    filter = {},
    combinedData = [],
    page = 1,
    includeCancelled = false,
    isAggregation = false,
  } = {}) {
    return apiClient
      .findAll('allocation', {
        ...filter,
        page,
        per_page: isAggregation ? 1 : 100,
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
          combinedData: results,
          filter,
          page: page + 1,
        })
      })
  },
  getByDateAndLocation({
    moveDate = [],
    fromLocationId,
    toLocationId,
    includeCancelled = false,
    isAggregation = false,
    status,
  } = {}) {
    const [moveDateFrom, moveDateTo] = moveDate

    return allocationService.getAll({
      filter: pickBy({
        'filter[date_from]': moveDateFrom,
        'filter[date_to]': moveDateTo,
        'filter[from_locations]': fromLocationId,
        'filter[status]': status,
        'filter[to_locations]': toLocationId,
      }),
      includeCancelled,
      isAggregation,
    })
  },
  getById(id) {
    return apiClient
      .find('allocation', id)
      .then(response => response.data)
      .then(allocationService.transform())
  },
  getCancelledAllocations(args) {
    return allocationService.getByDateAndLocation({
      ...args,
      includeCancelled: true,
      status: 'cancelled',
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
}

module.exports = allocationService
