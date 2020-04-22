const { mapKeys } = require('lodash')

const apiClient = require('../lib/api-client')()

function urlKeyToFilter(additionalFilters) {
  return mapKeys(additionalFilters, (value, key) => {
    return `filter[${key}]`
  })
}
const allocationService = {
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
}

module.exports = allocationService
