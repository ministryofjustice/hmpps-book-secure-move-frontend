const { flattenDeep, sortBy } = require('lodash')

const apiClient = require('../lib/api-client')

function getGenders () {
  return apiClient
    .findAll('gender')
    .then(response => response.data)
}

function getEthnicities () {
  return apiClient
    .findAll('ethnicity')
    .then(response => response.data)
}

function getAssessmentQuestions (category) {
  return apiClient
    .findAll('assessment_question', {
      'filter[category]': category,
    })
    .then(response => response.data)
}

function mapToOption ({ id, title, key, conditional }) {
  const option = {
    value: id,
    text: title,
  }

  if (key) {
    option.key = key
  }

  if (conditional) {
    option.conditional = conditional
  }

  return option
}

function insertInitialOption (items, label = 'option') {
  const initialOption = {
    text: `--- Choose ${label} ---`,
  }

  return [initialOption, ...items]
}

function getLocations (type, combinedData, page = 1) {
  return apiClient.findAll('location', {
    page,
    per_page: 100,
    'filter[location_type]': type,
  }).then((response) => {
    const { data, links } = response
    const locations = combinedData ? flattenDeep([combinedData, ...response.data]) : data

    if (!links.next) {
      return sortBy(locations, 'title')
    }

    return getLocations(type, locations, page + 1)
  })
}

module.exports = {
  getGenders,
  getEthnicities,
  getAssessmentQuestions,
  getLocations,
  mapToOption,
  insertInitialOption,
}
