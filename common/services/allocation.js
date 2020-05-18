const { mapKeys, mapValues, pickBy } = require('lodash')

const apiClient = require('../lib/api-client')()

function urlKeyToFilter(additionalFilters) {
  return mapKeys(additionalFilters, (value, key) => {
    return `filter[${key}]`
  })
}
const allocationService = {
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
  create(data) {
    return apiClient
      .create('allocation', allocationService.format(data))
      .then(response => response.data)
  },
  getCount({ dateRange = [], additionalFilters }) {
    const [dateFrom, dateTo] = dateRange
    const filter = {
      'filter[date_from]': dateFrom,
      'filter[date_to]': dateTo,
      ...urlKeyToFilter(additionalFilters),
    }
    return apiClient
      .findAll('allocation', {
        ...filter,
        page: 1,
        per_page: 1,
      })
      .then(response => response.meta.pagination.total_objects)
  },
  getByDateAndLocation({
    moveDate = [],
    createdAtDate = [],
    fromLocationId,
    toLocationId,
    isAggregation = false,
    sortBy = 'date',
    sortDirection = 'desc',
  } = {}) {
    const [moveDateFrom, moveDateTo] = moveDate
    const [createdAtFrom, createdAtTo] = createdAtDate

    return allocationService.getAll({
      isAggregation,
      filter: pickBy({
        'filter[from_locations]': fromLocationId,
        'filter[to_locations]': toLocationId,
        'filter[date_from]': moveDateFrom,
        'filter[date_to]': moveDateTo,
        'filter[created_at_from]': createdAtFrom,
        'filter[created_at_to]': createdAtTo,
        'sort[by]': sortBy,
        'sort[direction]': sortDirection,
      }),
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
          return results
        }

        return allocationService.getAll({
          filter,
          combinedData: results,
          page: page + 1,
        })
      })
  },
  getById(id) {
    return apiClient.find('allocation', id).then(response => response.data)
  },
}

module.exports = allocationService
