// https://hmpps-book-secure-move-api-staging.apps.live-1.cloud-platform.service.justice.gov.uk/api/v1/allocations?filter[status]=unfilled&filter[locations]=a4db0d71-04d8-4313-b781-abc1530c2874%2C0c037872-48ad-42fa-84b2-b6f624480af2%2C7e8cc42f-0720-4123-8080-35d41798338c%2C5686a356-993b-47f0-ab1b-168e150410dc%2C186a2439-ee9e-4a34-8ddf-63ba52ba3ed1%2C056eed18-772b-45b3-b64a-4d7d563641f7%2Ce0bd4d4f-72f4-45e5-ba59-01d30dd4cdef%2C26bd697d-c90f-4d67-92d1-261df02f7f7a%2C16a549f8-8cd5-47e8-8272-2cfd5e459344%2Ce935e36b-6981-4213-ab34-bbfe36e6d566%2C689c75b2-23aa-4a0c-a331-33c43583a89a%2C28c06bf3-1791-4ed1-b58f-9bcdc656e16f%2C7366191b-fe72-4c01-a47f-f1a968bad97e%2Ccf12873e-545d-471a-b72f-cae6cec3a44f&filter[date_from]=2020-10-05&filter[date_to]=2020-10-11&page=1&per_page=1

const { flattenDeep, sortBy } = require('lodash')

const apiClient = require('../lib/api-client')()

const locationsFreeSpacesService = {
  getLocationsFreeSpaces({
    filter,
    combinedData,
    dateFrom,
    dateTo,
    locationIds,
    page = 1,
    include,
  } = {}) {
    return apiClient
      .findAll('locations_free_spaces', {
        filter: {
          location_type: 'prison',
          ...(locationIds && { location_id: locationIds }),
        },
        ...(locationIds && { location_id: locationIds }),
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
          return sortBy(locations, 'title')
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
}

module.exports = locationsFreeSpacesService
