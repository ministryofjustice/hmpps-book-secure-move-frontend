const { mapValues } = require('lodash')

const apiClient = require('../lib/api-client')

function getFullname ({
  first_names: firstNames,
  last_name: lastName,
}) {
  return `${lastName}, ${firstNames}`
}

function format (data) {
  const relationships = ['gender', 'ethnicity']
  const identifiers = [
    'police_national_computer',
    'criminal_records_office',
    'prison_number',
    'niche_reference',
    'athena_reference',
  ]

  const formatted = mapValues(data, (value, key) => {
    if (typeof value === 'string') {
      if (relationships.includes(key)) {
        return { id: value }
      }

      if (identifiers.includes(key)) {
        return { value, identifier_type: key }
      }
    }

    return value
  })

  return {
    ...formatted,
    identifiers: identifiers.map(key => formatted[key]).filter(Boolean),
  }
}

function create (data) {
  return apiClient
    .create('person', format(data))
    .then(response => response.data)
}

function update (data) {
  if (!data.id) {
    return
  }

  return apiClient
    .update('person', format(data))
    .then(response => response.data)
}

module.exports = {
  getFullname,
  format,
  create,
  update,
}
