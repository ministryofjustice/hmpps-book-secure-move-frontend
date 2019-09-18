const { kebabCase } = require('lodash')
const { TAG_CATEGORY_WHITELIST } = require('../../config')

module.exports = function assessmentAnswerToTag(hrefPrefix = '') {
  return function buildTag({ title, category }) {
    const whitelisted = TAG_CATEGORY_WHITELIST[category]

    return {
      href: `${hrefPrefix}#${kebabCase(title)}`,
      text: title,
      classes: whitelisted ? whitelisted.tagClass : 'app-tag--inactive',
      sortOrder: whitelisted ? whitelisted.sortOrder : null,
    }
  }
}
