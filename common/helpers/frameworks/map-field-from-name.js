function mapFieldFromName(allFields = {}) {
  return fieldName => {
    const field = allFields[fieldName] || {}

    if (!field.items) {
      return field
    }

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
}

module.exports = mapFieldFromName
