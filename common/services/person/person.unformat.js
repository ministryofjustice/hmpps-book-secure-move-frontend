const filters = require('../../../config/nunjucks/filters')

const mapMethods = {}

mapMethods.identifier = (person, field) => {
  const identifiers = person.identifiers || []
  const identifier = identifiers.filter(
    identifier => identifier.identifier_type === field
  )[0]

  if (identifier) {
    return identifier.value
  }
}

mapMethods.relationship = (person, field) => {
  const relationship = person[field]

  if (relationship) {
    return relationship.id
  }
}

mapMethods.date = (person, field) => {
  const fieldValue = person[field]

  if (fieldValue) {
    return filters.formatDate(fieldValue)
  }
}

mapMethods.value = (person, field) => person[field]

const mapKeys = Object.keys(mapMethods)

const unformat = (person, fields = [], fieldKeys = {}) => {
  const assessmentCategories = {}

  const fieldData = fields.map(field => {
    const method =
      mapKeys.filter(
        key => fieldKeys[key] && fieldKeys[key].includes(field)
      )[0] || 'value'
    const value = mapMethods[method](person, field, assessmentCategories)
    return { [field]: value }
  })
  return Object.assign({}, ...fieldData, assessmentCategories)
}

module.exports = unformat
