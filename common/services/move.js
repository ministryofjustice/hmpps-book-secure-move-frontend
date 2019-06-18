const { mapValues } = require('lodash')

const apiClient = require('../lib/api-client')

function format (data) {
  const relationships = ['to_location', 'from_location']

  return mapValues(data, (value, key) => {
    if (relationships.includes(key) && typeof value === 'string') {
      return { id: value }
    }
    return value
  })
}

function getMovesByDate (moveDate) {
  return apiClient.findAll('move', {
    'filter[date_from]': moveDate,
    'filter[date_to]': moveDate,
  })
}

function getMoveById (id) {
  return apiClient.find('move', id)
}

function create (data) {
  return apiClient
    .create('move', format(data))
    .then(response => response.data)
}

module.exports = {
  format,
  getMovesByDate,
  getMoveById,
  create,
}
