const { filter, groupBy, sortBy, mapValues } = require('lodash')

const { TAG_CATEGORY_WHITELIST } = require('../../config')

module.exports = function assessmentByCategory(assessment) {
  const mapped = mapValues(TAG_CATEGORY_WHITELIST, (params, category) => {
    const answers = filter(assessment, { category })
    return {
      ...params,
      key: category,
      answersByTitle: groupBy(answers, 'title'),
    }
  })

  return sortBy(mapped, 'sortOrder')
}
