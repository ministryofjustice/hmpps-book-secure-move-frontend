const { mapValues } = require('lodash')

const apiClient = require('../lib/api-client')

function format(data) {
  const relationships = ['to_location', 'from_location']

  return mapValues(data, (value, key) => {
    if (relationships.includes(key) && typeof value === 'string') {
      return { id: value }
    }
    return value
  })
}

function getRequestedMovesByDateAndLocation(moveDate, locationId) {
  return apiClient
    .findAll('move', {
      'filter[status]': 'requested',
      'filter[date_from]': moveDate,
      'filter[date_to]': moveDate,
      'filter[from_location_id]': locationId,
    })
    .then(response => response.data)
}

function getMoveById(id) {
  return apiClient.find('move', id)
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
  getRequestedMovesByDateAndLocation,
  getMoveById,
  create,
  cancel,
}
