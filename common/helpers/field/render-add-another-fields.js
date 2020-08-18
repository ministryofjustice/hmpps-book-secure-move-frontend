const { fromPairs, filter } = require('lodash')

const componentService = require('../../services/component')

function renderAddAnotherFields([key, field], index, obj) {
  if (!field.descendants) {
    return [key, field]
  }

  const allFields = fromPairs(obj)
  const currentItems = filter(field.value)
  const items = currentItems.map((item, index) => {
    const itemFields = field.descendants.reduce((acc, itemFieldName) => {
      const fieldKey = `${field.name}[${index}][${itemFieldName}]`
      const itemField = allFields[fieldKey]

      if (!itemField) {
        return acc
      }

      const html = componentService.getComponent(itemField.component, itemField)

      return [...acc, html]
    }, [])

    return {
      html: itemFields.join('\n'),
    }
  })

  return [
    key,
    {
      ...field,
      items,
    },
  ]
}

module.exports = renderAddAnotherFields
