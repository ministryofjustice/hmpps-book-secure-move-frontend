const { sortBy, uniqBy, kebabCase } = require('lodash')

const { FRAMEWORKS } = require('../../config')

function frameworkFlagsToTagList({
  flags = [],
  hrefPrefix = '',
  includeLink = false,
} = {}) {
  const tags = uniqBy(flags, 'title').map(({ flag_type: type, title } = {}) => {
    const settings = FRAMEWORKS.FLAG_SETTINGS[type] || {}
    const output = {
      text: title,
      classes: settings.tagClass || '',
      sortOrder: settings.sortOrder || null,
    }

    if (includeLink) {
      output.href = `${hrefPrefix}#${kebabCase(title)}`
    }

    return output
  })

  return sortBy(tags, ['sortOrder', 'text'])
}

module.exports = frameworkFlagsToTagList
