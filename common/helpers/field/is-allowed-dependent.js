const { intersection } = require('lodash')

function isAllowedDependent(fields, key, values) {
  const field = fields[key]

  if (!field) {
    return false
  }

  if (!field.dependent) {
    return true
  }

  // set up dependent to an object of field and value
  if (typeof field.dependent === 'string') {
    field.dependent = {
      field: field.dependent,
      value: true,
    }
  }

  if (!fields[field.dependent.field]) {
    return true
  }

  // validate if any dependent value matches any field value
  const dependent = field.dependent
  const dependentValues = Array.isArray(dependent.value)
    ? dependent.value
    : [dependent.value]
  const fieldValues = Array.isArray(values[dependent.field])
    ? values[dependent.field]
    : [values[dependent.field]]

  const matches = intersection(dependentValues, fieldValues)

  return matches.length !== 0
}

module.exports = isAllowedDependent
