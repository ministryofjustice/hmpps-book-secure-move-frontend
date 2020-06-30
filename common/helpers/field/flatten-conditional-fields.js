const { isObject, concat } = require('lodash')

function flattenConditionalFields([key, field]) {
  if (!field.items) {
    return [key, field]
  }

  const items = field.items.map(item => {
    if (!item.conditional) {
      return item
    }

    const conditionals = concat([], item.conditional)
    const conditionalKeys = conditionals.map(conditional => {
      if (isObject(conditional)) {
        return conditional.name
      }

      return conditional
    })

    return { ...item, conditional: conditionalKeys }
  })

  return [key, { ...field, items }]
}

module.exports = flattenConditionalFields
