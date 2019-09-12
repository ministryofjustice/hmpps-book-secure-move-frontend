const { sortBy, uniqBy } = require('lodash')

const { TAG_CATEGORY_WHITELIST } = require('../../config')
const assessmentAnswerToTag = require('./assessment-answer-to-tag')

module.exports = function assessmentToTagList(answers, hrefPrefix = '') {
  const tags = uniqBy(answers, 'title')
    .filter(answer => TAG_CATEGORY_WHITELIST[answer.category])
    .map(assessmentAnswerToTag(hrefPrefix))

  return sortBy(tags, 'sortOrder')
}
