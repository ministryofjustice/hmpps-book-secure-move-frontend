const { sortBy, mapValues } = require('lodash')

const { TAG_CATEGORY_WHITELIST } = require('../../config')
const { filterExpired } = require('../helpers/reference-data')

module.exports = function assessmentAnswersByCategory(assessmentAnswers = []) {
  const mapped = mapValues(TAG_CATEGORY_WHITELIST, (params, category) => {
    const answers = assessmentAnswers
      .filter(answer => answer.category === category)
      .filter(filterExpired)

    return {
      ...params,
      answers,
      key: category,
    }
  })

  return sortBy(mapped, 'sortOrder')
}
