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
  const referrerValues = { ...values }
  Object.keys(fields).forEach(filter => {
    delete referrerValues[filter]
  })
  Object.keys(referrerValues).forEach(key => {
    if (!Array.isArray(referrerValues[key])) {
      referrerValues[key] = [referrerValues[key]]
    }
  })

  return referrerValues
}

module.exports = {
  getDefaultValues,
  removeDefaultFilterValues,
  getReferrerValues,
}
