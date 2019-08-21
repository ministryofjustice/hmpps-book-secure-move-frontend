const { mapValues, pickBy } = require('lodash')

const apiClient = require('../lib/api-client')

function format(data) {
  const relationships = ['to_location', 'from_location']

  return mapValues(pickBy(data), (value, key) => {
    if (relationships.includes(key) && typeof value === 'string') {
      return { id: value }
    }
    return value
  })
}

function getMoves({ filter, combinedData = [], page = 1 } = {}) {
  return apiClient
    .findAll('move', {
      ...filter,
      page,
      per_page: 100,
    })
    .then(response => {
      const { data, links } = response
      const items = [...combinedData, ...data]

      if (!links.next) {
        return items
      }

      return getMoves({
        filter,
        combinedData: items,
        page: page + 1,
      })
    })
}

function getRequestedMovesByDateAndLocation(moveDate, locationId) {
  return getMoves({
    filter: {
      'filter[status]': 'requested',
      'filter[date_from]': moveDate,
      'filter[date_to]': moveDate,
      'filter[from_location_id]': locationId,
    },
  })
}

function getMoveById(id) {
  return apiClient.find('move', id).then(response => response.data)
}

function create(data) {
  return apiClient.create('move', format(data)).then(response => response.data)
}

function cancel(id) {
  if (!id) {
    return
  }

  return apiClient
    .update('move', {
      id,
      status: 'cancelled',
    })
    .then(response => response.data)
}

module.exports = {
  format,
  getMoves,
  getRequestedMovesByDateAndLocation,
  getMoveById,
  create,
  cancel,
}
