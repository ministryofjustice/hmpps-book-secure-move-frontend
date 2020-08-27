const { flatten, kebabCase, pickBy } = require('lodash')

function responsesToSaveReducer(values = {}) {
  return (accumulator, { id, question }) => {
    const { key: fieldName, response_type: responseType } = question
    const value = values[fieldName]
    let responseValue

    if (!value) {
      return accumulator
    }

    if (responseType === 'object::followup_comment') {
      responseValue = pickBy({
        option: value,
        details: values[`${fieldName}--${kebabCase(value)}`],
      })
    }

    if (responseType === 'collection::followup_comment') {
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

    if (responseType === 'collection::add_multiple_items') {
      const collection = value.filter(Boolean).map((itemValues, itemIndex) => {
        const itemResponses = question.descendants
          .map(q => ({ question: q }))
          .reduce(responsesToSaveReducer(itemValues), [])

        return {
          item: itemIndex,
          responses: itemResponses,
        }
      })

      responseValue = collection
    }

    if (responseType === 'array') {
      responseValue = flatten([value]).filter(Boolean)
    }

    if (responseType === 'string') {
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
