const { flattenDeep, omitBy, isEmpty, groupBy } = require('lodash')

const apiClient = require('../lib/api-client')()

const locationsFreeSpacesService = {
  getLocationsFreeSpaces({
    filter,
    combinedData,
    dateFrom,
    dateTo,
    page = 1,
    include,
  } = {}) {
    return apiClient
      .findAll('locations_free_spaces', {
        ...filter,
        page,
        per_page: 100,
        include,
        date_from: dateFrom,
        date_to: dateTo,
      })
      .then(response => {
        const { data, links } = response
        const locations = combinedData
          ? flattenDeep([combinedData, ...response.data])
          : data

        const hasNext = links.next && data.length !== 0

        if (!hasNext) {
          return locations
        }

        return locationsFreeSpacesService.getLocationsFreeSpaces({
          filter,
          page: page + 1,
          combinedData: locations,
          include,
          dateFrom,
          dateTo,
        })
      })
  },
  async getPrisonFreeSpaces({ dateFrom, dateTo, locationIds } = {}) {
    const locations = await locationsFreeSpacesService.getLocationsFreeSpaces({
      dateFrom,
      dateTo,
      filter: omitBy(
        {
          'filter[location_type]': 'prison',
          'filter[location_id]': locationIds,
        },
        isEmpty
      ),
      include: ['category'],
    })

    const groupedLocations = groupBy(locations, value => {
      return value?.category?.title || 'No Category'
    })

    return groupedLocations
  },
}

module.exports = locationsFreeSpacesService
