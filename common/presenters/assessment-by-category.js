const { groupBy, sortBy, mapValues } = require('lodash')

const { filterExpired } = require('../../common/helpers/reference-data')
const { TAG_CATEGORY_WHITELIST } = require('../../config')

module.exports = function assessmentByCategory(assessment) {
  const mapped = mapValues(TAG_CATEGORY_WHITELIST, (params, category) => {
    const answers = assessment
      .filter(answer => answer.category === category)
      .filter(filterExpired)

    return {
      ...params,
      key: category,
      answersByTitle: groupBy(answers, 'title'),
    }
  })

  return sortBy(mapped, 'sortOrder')
}
