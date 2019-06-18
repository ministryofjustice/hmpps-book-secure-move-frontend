const { TAG_CATEGORY_WHITELIST } = require('../../config')

module.exports = function assessmentAnswerToTag (hrefPrefix = '') {
  return function map ({ key, title, category }) {
    const whitelisted = TAG_CATEGORY_WHITELIST[category]

    return {
      href: `${hrefPrefix}#${key}`,
      text: title,
      classes: whitelisted ? whitelisted.tagClass : 'app-tag--inactive',
      sortOrder: whitelisted ? whitelisted.sortOrder : null,
    }
  }
}
