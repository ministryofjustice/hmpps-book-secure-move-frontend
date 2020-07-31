const { sortBy, uniqBy, kebabCase } = require('lodash')

const { FRAMEWORKS } = require('../../config')

function frameworkFlagsToTagList(flags = [], hrefPrefix = '') {
  const tags = uniqBy(flags, 'title').map(
    ({ flag_type: type, title, question } = {}) => {
      const settings = FRAMEWORKS.FLAG_SETTINGS[type] || {}

      return {
        text: title,
        section: question?.section,
        href: `${hrefPrefix}#${kebabCase(title)}`,
        classes: settings.tagClass || '',
        sortOrder: settings.sortOrder || null,
      }
    }
  )

  return sortBy(tags, ['sortOrder', 'text'])
}

module.exports = frameworkFlagsToTagList
