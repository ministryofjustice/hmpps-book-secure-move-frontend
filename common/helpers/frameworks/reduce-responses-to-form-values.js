const { find, kebabCase, forOwn } = require('lodash')

function reduceResponsesToFormValues(
  accumulator,
  { value, value_type: valueType, question }
) {
  const field = question?.key

  if (valueType === 'object' || valueType === 'object::followup_comment') {
    accumulator[field] = value.option
    accumulator[`${field}--${kebabCase(value.option)}`] = value.details
  }

  if (
    valueType === 'collection' ||
    valueType === 'collection::followup_comment'
  ) {
    accumulator[field] = value.map(item => item.option)
    question.options.forEach(option => {
      const item = find(value, { option })
      accumulator[`${field}--${kebabCase(option)}`] = item?.details
    })
  }

  if (valueType === 'collection::add_multiple_items') {
    accumulator[field] = value.map((item, index) => {
      const values = item.responses
        .map(response => {
          const q = find(question.descendants, {
            id: response.framework_question_id,
          })

          return {
            ...response,
            question: q,
            value_type: q?.response_type,
          }
        })
        .reduce(reduceResponsesToFormValues, {})

      forOwn(values, (v, k) => {
        accumulator[`${field}[${index}][${k}]`] = v
      })

      return values
    })
  }

  if (valueType === 'string' || valueType === 'array') {
    accumulator[field] = value
  }

  return accumulator
}

module.exports = reduceResponsesToFormValues
