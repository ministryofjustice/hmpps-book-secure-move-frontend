// Helper function to add data- attrs to enable moj-add-another to add/remove on clientside
function getDataAttributes(item, name, index) {
  const dataId = (name + (index ? `${index + 1}` : ''))
    .replace(/\[|\]/gi, '-')
    .replace(/-\s*$/gi, '')
  return {
    'data-name': name,
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
        const id = name.replace(/\[|\]/gi, '-').replace(/-\s*$/gi, '')
        const dataName = name.replace(`[${index}]`, '[%index%]')
        const options = {
          // tell form wizard to not render field at top level
          skip: true,
          prefix,
          name,
          id,
          attributes: getDataAttributes(descendantField, dataName),
        }

        if (descendantField.items) {
          // No data attributes or else first element id will clash with container since govukMacros don't suffix it
          delete options.attributes

          options.idPrefix = id

          descendantField.items = descendantField.items.map((item, index) => {
            return {
              ...item,
              attributes: getDataAttributes(item, dataName, index),
            }
          })
        }

        accumulator[name] = {
          ...descendantField,
          ...options,
        }
      })
    })

    return accumulator
  }
}

module.exports = reduceAddAnotherFields
