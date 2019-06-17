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

function mapToOption ({ id, title }) {
  return {
    value: id,
    text: title,
  }
}

function insertInitialOption (items, label = 'option') {
  const initialOption = {
    text: `--- Choose ${label} ---`,
  }

  return [initialOption, ...items]
}

module.exports = {
  getGenders,
  getEthnicities,
  getAssessmentQuestions,
  mapToOption,
  insertInitialOption,
}
