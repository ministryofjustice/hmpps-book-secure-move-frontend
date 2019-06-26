const { flattenDeep, sortBy } = require('lodash')

const apiClient = require('../lib/api-client')
const componentService = require('./component')

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

function mapAssessmentConditionalFields (fields) {
  return function (item) {
    const fieldName = `${item.category}__${item.key}`
    const field = fields[fieldName]

    if (!field) {
      return item
    }

    const params = { ...field, id: fieldName, name: fieldName }
    const html = componentService.getComponent(params.component, params)

    return { ...item, conditional: { html } }
  }
}

module.exports = {
  getGenders,
  getEthnicities,
  getAssessmentQuestions,
  getLocations,
  mapAssessmentConditionalFields,
}
