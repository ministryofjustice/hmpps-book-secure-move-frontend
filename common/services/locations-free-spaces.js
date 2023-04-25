const { flattenDeep, omitBy, isEmpty, groupBy } = require('lodash')

const { BaseService } = require('./base')

class LocationsFreeSpacesService extends BaseService {
  getLocationsFreeSpaces({
    filter,
    combinedData,
    dateFrom,
    dateTo,
    page = 1,
    include,
  } = {}) {
    return this.apiClient
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

        return this.getLocationsFreeSpaces({
          filter,
          page: page + 1,
          combinedData: locations,
          include,
          dateFrom,
          dateTo,
        })
      })
  }

  async getPrisonFreeSpaces({ dateFrom, dateTo, locationIds } = {}) {
    const locations = await this.getLocationsFreeSpaces({
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
  }
}

module.exports = LocationsFreeSpacesService
