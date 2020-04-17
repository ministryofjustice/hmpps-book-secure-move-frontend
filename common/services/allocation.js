const apiClient = require('../lib/api-client')()

const allocationService = {
  getCount({ dateRange = [] }) {
    const [dateFrom, dateTo] = dateRange
    const filter = {
      'filter[date_from]': dateFrom,
      'filter[date_to]': dateTo,
    }
    return apiClient
      .findAll('allocation', {
        ...filter,
        page: 1,
        per_page: 1,
      })
      .then(response => response.meta.pagination.total_objects)
  },
}

module.exports = allocationService
