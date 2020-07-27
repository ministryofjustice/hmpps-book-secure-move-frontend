const { sortBy, uniqBy, kebabCase } = require('lodash')

const { FRAMEWORKS } = require('../../config')

function frameworkFlagsToTagList(flags = [], hrefPrefix = '') {
  const tags = uniqBy(flags, 'title').map(({ flag_type: category, title }) => {
    const settings = FRAMEWORKS.FLAG_SETTINGS[category] || {}

    return {
      text: title,
      href: `${hrefPrefix}#${kebabCase(title)}`,
      classes: settings.tagClass || '',
      sortOrder: settings.sortOrder || null,
    }
  })

  return sortBy(tags, ['sortOrder', 'text'])
}

module.exports = frameworkFlagsToTagList
