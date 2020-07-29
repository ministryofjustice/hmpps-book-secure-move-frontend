const { sortBy, mapValues } = require('lodash')

const { ASSESSMENT_ANSWERS_CATEGORY_SETTINGS } = require('../../config')
const referenceDataHelpers = require('../helpers/reference-data')

module.exports = function assessmentAnswersByCategory(assessmentAnswers = []) {
  const mapped = mapValues(
    ASSESSMENT_ANSWERS_CATEGORY_SETTINGS,
    (params, category) => {
      const answers = assessmentAnswers
        .filter(answer => answer.category === category)
        .filter(referenceDataHelpers.filterExpired)

      return {
        ...params,
        answers,
        key: category,
      }
    }
  )

  return sortBy(mapped, 'sortOrder')
}
