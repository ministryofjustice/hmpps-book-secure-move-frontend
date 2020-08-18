const { find, kebabCase } = require('lodash')

function reduceResponsesToFormValues(
  accumulator,
  { value, value_type: valueType, question }
) {
  const field = question?.key

  if (valueType === 'object') {
    accumulator[field] = value.option
    accumulator[`${field}--${kebabCase(value.option)}`] = value.details
  }

  if (valueType === 'collection') {
    accumulator[field] = value.map(item => item.option)
    question.options.forEach(option => {
      const item = find(value, { option })
      accumulator[`${field}--${kebabCase(option)}`] = item?.details
    })
  }

  if (valueType === 'string' || valueType === 'array') {
    accumulator[field] = value
  }

  return accumulator
}

module.exports = reduceResponsesToFormValues
