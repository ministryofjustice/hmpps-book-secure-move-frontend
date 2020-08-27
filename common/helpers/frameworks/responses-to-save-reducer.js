const { flatten, kebabCase, pickBy } = require('lodash')

function responsesToSaveReducer(values = {}) {
  return (accumulator, { id, question, value_type: valueType }) => {
    const fieldName = question.key
    const value = values[fieldName]

    if (valueType === 'object' || valueType === 'object::followup_comment') {
      accumulator.push({
        id,
        value: pickBy({
          option: value,
          details: values[`${fieldName}--${kebabCase(value)}`],
        }),
      })
    }

    if (valueType === 'collection::add_multiple_items') {
      const collection = value.filter(Boolean).map((item, index) => {
        return {
          item: index,
          responses: question.descendants.map(que => {
            let value

            // TODO: Support all value types for child responses
            if (que.response_type === 'string') {
              value = item[que.key]
            }

            if (
              que.response_type === 'collection' ||
              que.response_type === 'collection::followup_comment'
            ) {
              value = flatten([item[que.key]])
                .filter(Boolean)
                .map(option => {
                  return {
                    option,
                    details: item[`${que.key}--${kebabCase(option)}`],
                  }
                })
            }

            return {
              value: value,
              framework_question_id: que.id,
            }
          }),
        }
      })

      accumulator.push({
        id,
        value: collection,
      })
    }

    if (
      valueType === 'collection' ||
      valueType === 'collection::followup_comment'
    ) {
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
