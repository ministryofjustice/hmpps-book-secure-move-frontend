function reduceAddAnotherFields(allFields = {}, values = {}) {
  return function reducer(accumulator, [key, field]) {
    if (!field.descendants) {
      return accumulator
    }

    field.descendants.forEach(itemField => {
      const value = values[field.name] || []

      value.forEach((item, index) => {
        const fieldTemplate = allFields[itemField]

        if (!fieldTemplate) {
          return
        }

        const prefix = `${field.name}[${index}]`
        const name = `${prefix}[${itemField}]`
        // IDs cannot contain square brackets so they need to be removed
        const id = name.replace(/\[|\]/gi, '-')
        const opts = {
          // tell form wizard to not render field at top level
          skip: true,
          idPrefix: id,
          prefix,
          name,
          id,
        }

        accumulator[name] = {
          ...fieldTemplate,
          ...opts,
        }
      })
    })

    return accumulator
  }
}

module.exports = reduceAddAnotherFields
