const { mapKeys, mapValues } = require('lodash')

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
  getByStatus({ dateRange = [], additionalFilters }) {
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
        per_page: 100,
      })
      .then(response => response.data)
  },
  getById(id) {
    return apiClient.find('allocation', id).then(response => response.data)
  },
}

module.exports = allocationService
