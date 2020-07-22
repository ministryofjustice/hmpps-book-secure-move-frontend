const { kebabCase, pickBy } = require('lodash')

function responsesToSaveReducer(values = {}) {
  return (accumulator, { id, question, value_type: valueType }) => {
    const fieldName = question.key
    const value = values[fieldName]

    if (valueType === 'object') {
      accumulator.push({
        id,
        value: pickBy({
          option: value,
          details: values[`${fieldName}--${kebabCase(value)}`],
        }),
      })
    }

    if (valueType === 'collection') {
      const collection = value.filter(Boolean).map(option => {
        return {
          option,
          details: values[`${fieldName}--${kebabCase(option)}`],
        }
      })

      accumulator.push({
        id,
        value: collection,
      })
    }

    if (valueType === 'array') {
      accumulator.push({ id, value: value.filter(Boolean) })
    }

    if (valueType === 'string') {
      accumulator.push({ id, value })
    }

    return accumulator
  }
}

module.exports = responsesToSaveReducer
