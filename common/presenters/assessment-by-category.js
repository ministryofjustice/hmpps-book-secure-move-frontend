const { TAG_CATEGORY_WHITELIST } = require('../../config')
const { filter, sortBy, mapValues } = require('lodash')

module.exports = function assessmentByCategory (assessment) {
  const mapped = mapValues(TAG_CATEGORY_WHITELIST, (params, category) => {
    params.category = category
    params.items = filter(assessment, { category })
    return params
  })

  return sortBy(mapped, 'sortOrder')
}
