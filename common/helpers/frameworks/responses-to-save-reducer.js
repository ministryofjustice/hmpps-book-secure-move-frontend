const { flatten, kebabCase, pickBy } = require('lodash')

function responsesToSaveReducer(values = {}) {
  return (accumulator, { id, question, value_type: valueType }) => {
    const fieldName = question.key
    const value = values[fieldName]
    let responseValue

    if (!value) {
      return accumulator
    }

    if (valueType === 'object' || valueType === 'object::followup_comment') {
      responseValue = pickBy({
        option: value,
        details: values[`${fieldName}--${kebabCase(value)}`],
      })
    }

    if (
      valueType === 'collection' ||
      valueType === 'collection::followup_comment'
    ) {
      const collection = flatten([value])
        .filter(Boolean)
        .map(option => {
          return {
            option,
            details: values[`${fieldName}--${kebabCase(option)}`],
          }
        })

      responseValue = collection
    }

    if (valueType === 'collection::add_multiple_items') {
      const collection = value.filter(Boolean).map((itemValues, itemIndex) => {
        const itemResponses = question.descendants
          .map(que => {
            return {
              question: que,
              value_type: que.response_type,
            }
          })
          .reduce(responsesToSaveReducer(itemValues), [])

        return {
          item: itemIndex,
          responses: itemResponses,
        }
      })

      responseValue = collection
    }

    if (valueType === 'array') {
      responseValue = flatten([value]).filter(Boolean)
    }

    if (valueType === 'string') {
      responseValue = value
    }

    if (responseValue) {
      accumulator.push(
        pickBy({
          id,
          value: responseValue,
          framework_question_id: id ? undefined : question.id,
        })
      )
    }

    return accumulator
  }
}

module.exports = responsesToSaveReducer
