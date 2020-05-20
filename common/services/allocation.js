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
    isAggregation = false,
    status,
  } = {}) {
    const [moveDateFrom, moveDateTo] = moveDate

    return allocationService.getAll({
      isAggregation,
      filter: pickBy({
        'filter[status]': status,
        'filter[from_locations]': fromLocationId,
        'filter[to_locations]': toLocationId,
        'filter[date_from]': moveDateFrom,
        'filter[date_to]': moveDateTo,
      }),
    })
  },
  getActiveAllocations(allocationsParams) {
    return allocationService.getByDateAndLocation({
      ...allocationsParams,
      status: ['filled', 'unfilled'],
    })
  },
  getCancelledAllocations(allocationsParams) {
    return allocationService.getByDateAndLocation({
      ...allocationsParams,
      status: 'cancelled',
    })
  },
  getAll({
    filter = {},
    combinedData = [],
    page = 1,
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
          return results.map(allocationService.transform())
        }

        return allocationService.getAll({
          filter,
          combinedData: results,
          page: page + 1,
        })
      })
  },
  getById(id) {
    return apiClient
      .find('allocation', id)
      .then(response => response.data)
      .then(allocationService.transform())
  },
}

module.exports = allocationService
