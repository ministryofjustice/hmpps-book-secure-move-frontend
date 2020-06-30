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
        if (isObject(conditional)) {
          accumulator[conditional.name] = {
            ...conditional,
            ...dependentOptions,
          }
        }

        const conditionalField = allFields[conditional]

        if (!conditionalField) {
          return
        }

        accumulator[conditional] = {
          ...conditionalField,
          ...dependentOptions,
        }
      })
    })

    return accumulator
  }
}

module.exports = reduceDependentFields
