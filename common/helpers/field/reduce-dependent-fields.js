const { isObject, flatten } = require('lodash')

function reduceDependentFields(allFields = {}) {
  return function reducer(accumulator, [key, field]) {
    if (!field.items) {
      return accumulator
    }

    field.items.forEach(item => {
      const conditionals = flatten([item.conditional || []])
      const dependentOptions = {
        // tell form wizard to not render field at top level
        skip: true,
        // set dependent object for validation
        dependent: {
          field: key,
          value: item.value,
        },
      }

      conditionals.forEach(conditional => {
        const conditionalField = isObject(conditional)
          ? conditional
          : allFields[conditional]

        if (!conditionalField) {
          return
        }

        const name = field.prefix
          ? `${field.prefix}[${conditionalField.name || conditional}]`
          : conditionalField.name || conditional
        const id = field.prefix
          ? `${field.id}-${conditionalField.id || conditional}`
          : conditionalField.id || conditional

        const dataName = name.replace(/\[\d+\]/, '[%index%]')
        const dataId = id.replace(/-\d+--/, '-%index%--')

        accumulator[name] = {
          ...conditionalField,
          ...dependentOptions,
          name,
          id,
          attributes: {
            'data-name': dataName,
            'data-id': dataId,
          },
        }
      })
    })

    return accumulator
  }
}

module.exports = reduceDependentFields
