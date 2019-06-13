const { mapValues } = require('lodash')

const apiClient = require('../lib/api-client')

function format (data) {
  const relationships = ['gender', 'ethnicity']

  return mapValues(data, (value, key) => {
    if (relationships.includes(key) && typeof value === 'string') {
      return { id: value }
    }
    return value
  })
}

function create (data) {
  return apiClient
    .create('person', format(data))
    .then(response => response.data)
}

module.exports = {
  format,
  create,
}
