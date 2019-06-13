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
    .findAll('profile_attribute_type', {
      'filter[category]': category,
    })
    .then(response => response.data)
}

module.exports = {
  getGenders,
  getEthnicities,
  getAssessmentQuestions,
}
