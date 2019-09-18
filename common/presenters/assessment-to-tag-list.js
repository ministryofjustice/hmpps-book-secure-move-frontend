const { sortBy, uniqBy } = require('lodash')

const { TAG_CATEGORY_WHITELIST } = require('../../config')
const { filterExpired } = require('../../common/helpers/reference-data')
const assessmentAnswerToTag = require('./assessment-answer-to-tag')

module.exports = function assessmentToTagList(answers, hrefPrefix = '') {
  const tags = uniqBy(answers, 'title')
    .filter(answer => TAG_CATEGORY_WHITELIST[answer.category])
    .filter(filterExpired)
    .map(assessmentAnswerToTag(hrefPrefix))

  return sortBy(tags, 'sortOrder')
}
