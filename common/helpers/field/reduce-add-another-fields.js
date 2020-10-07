// Helper function to add data- attrs to enable moj-add-another to add/remove on clientside
function getDataAttributes(item, dataName) {
  const dataId = dataName.replace(/\[|\]/gi, '-')
  return {
    'data-name': dataName,
    'data-id': dataId,
    ...item.attributes,
  }
}

function reduceAddAnotherFields(allFields = {}, values = {}) {
  return function reducer(accumulator, [key, field]) {
    if (!field.descendants) {
      return accumulator
    }

    field.descendants.forEach(descendant => {
      const value = values[field.name] || []

      value.forEach((item, index) => {
        const descendantField = allFields[descendant]

        if (!descendantField) {
          return
        }

        const prefix = `${field.name}[${index}]`
        const name = `${prefix}[${descendant}]`
        // IDs cannot contain square brackets so they need to be removed
        const id = name.replace(/\[|\]/gi, '-')

        const options = {
          // tell form wizard to not render field at top level
          skip: true,
          prefix,
          name,
          id,
        }

        const dataName = `${field.name}[%index%][${descendant}]`
        let extraOptions = {
          attributes: getDataAttributes(descendantField, dataName),
        }

        if (descendantField.items) {
          // No data attributes or else first element id will clash with container since govukMacros don't suffix it
          extraOptions = {
            idPrefix: id,
          }

          descendantField.items = descendantField.items.map((item, index) => {
            const itemDataName = `${dataName}${index ? `[${index + 1}]` : ''}`
            return {
              ...item,
              attributes: getDataAttributes(item, itemDataName),
            }
          })
        }

        accumulator[name] = {
          ...descendantField,
          ...options,
          ...extraOptions,
        }
      })
    })

    return accumulator
  }
}

module.exports = reduceAddAnotherFields
