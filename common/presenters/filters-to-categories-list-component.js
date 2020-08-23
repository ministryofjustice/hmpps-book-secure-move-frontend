const i18n = require('../../config/i18n')
const request = require('../lib/request')

const getCategoryItems = (fieldValues, values, pageUrl, key) => {
  const items = (Array.isArray(fieldValues) ? fieldValues : [fieldValues]).map(
    value => {
      const removeValues = { ...values }

      if (Array.isArray(fieldValues)) {
        removeValues[key] = fieldValues.filter(v => v !== value)
      } else {
        delete removeValues[key]
      }

      const href = request.getUrl(pageUrl, removeValues)
      return {
        href,
        text: i18n.t(`filters::${key}.${value}.label`),
      }
    }
  )
  return items
}

const filtersToCategoriesListComponent = (fields, values, pageUrl) => {
  const categories = Object.keys(fields)
    .map(key => {
      const fieldValues = values[key]

      if (!fieldValues || fieldValues === 'default') {
        return
      }

      const heading = {
        text: i18n.t(`filters::${key}.legend`, { context: 'display' }),
      }

      const items = getCategoryItems(fieldValues, values, pageUrl, key)

      return {
        heading,
        items,
      }
    })
    .filter(cat => cat)

  return categories
}

module.exports = filtersToCategoriesListComponent
