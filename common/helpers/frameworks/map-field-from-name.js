function mapFieldFromName(allFields = {}) {
  return fieldName => {
    const field = allFields[fieldName] || {}

    if (field.items) {
      return {
        ...field,
        items: field.items.map(item => {
          if (!item.followup) {
            return item
          }

          return {
            ...item,
            followup: item.followup.map(mapFieldFromName(allFields)),
          }
        }),
      }
    }

    if (field.descendants) {
      return {
        ...field,
        descendants: field.descendants.map(mapFieldFromName(allFields)),
      }
    }

    return field
  }
}

module.exports = mapFieldFromName
