const { mapValues, uniqBy } = require('lodash')

const apiClient = require('../lib/api-client')

function getFullname({ first_names: firstNames, last_name: lastName }) {
  return `${lastName}, ${firstNames}`
}

function format(data) {
  const existingIdentifiers = data.identifiers || []
  const relationshipKeys = ['gender', 'ethnicity']
  const identifierKeys = [
    'police_national_computer',
    'criminal_records_office',
    'prison_number',
    'niche_reference',
    'athena_reference',
  ]

  const formatted = mapValues(data, (value, key) => {
    if (typeof value === 'string') {
      if (relationshipKeys.includes(key)) {
        return { id: value }
      }

      if (identifierKeys.includes(key)) {
        return { value, identifier_type: key }
      }
    }

    return value
  })

  const identifiers = uniqBy(
    [
      ...identifierKeys.map(key => formatted[key]).filter(Boolean),
      ...existingIdentifiers,
    ],
    'identifier_type'
  )

  return {
    ...formatted,
    identifiers,
  }
}

function create(data) {
  return apiClient
    .create('person', format(data))
    .then(response => response.data)
}

function update(data) {
  if (!data.id) {
    return
  }

  console.log(format(data))

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
