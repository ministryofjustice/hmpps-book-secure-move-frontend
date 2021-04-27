const { omit } = require('lodash')

const getDefaultValues = fields => {
  return Object.keys(fields).reduce((values, key) => {
    if (fields[key].defaultValue !== undefined) {
      values[key] = fields[key].defaultValue
    }

    return values
  }, {})
}

const removeDefaultFilterValues = (fields, values) => {
  const { referrer, ...valuesWithoutReferrer } = values
  const defaultValues = getDefaultValues(fields)

  return Object.keys(valuesWithoutReferrer).reduce((x, key) => {
    if (valuesWithoutReferrer[key] !== defaultValues[key]) {
      x[key] = values[key]
    }

    return x
  }, {})
}

const getReferrerValues = (fields, values) => {
  const omittedKeys = Object.keys(fields)

  return omit(values, omittedKeys)
}

module.exports = {
  getDefaultValues,
  removeDefaultFilterValues,
  getReferrerValues,
}
