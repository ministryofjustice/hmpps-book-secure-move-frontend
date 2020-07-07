const { filter, find } = require('lodash')

const componentService = require('../services/component')

function frameworkStepToSummary(allFields, responses, baseUrl) {
  return ([key, step]) => {
    const stepUrl = `${baseUrl}/${step.slug}`
    const stepFields = step.fields

    if (!stepFields.length) {
      return undefined
    }

    const summaryListRows = stepFields.map(fieldName => {
      const { id, description, question } = allFields[fieldName] || {}
      const rowHeader = description || question
      const response = find(responses, ['question.key', fieldName]) || {}

      if (!rowHeader) {
        return undefined
      }

      return {
        key: {
          text: rowHeader,
          classes: 'govuk-!-font-weight-regular',
        },
        value: {
          html: componentService.getComponent('appFrameworkResponse', {
            value: response.value,
            valueType: response.value_type,
            questionUrl: `${stepUrl}#${id}`,
          }),
        },
      }
    })

    return [
      key,
      {
        ...step,
        stepUrl,
        summaryListComponent: {
          classes: 'govuk-!-font-size-16',
          rows: filter(summaryListRows),
        },
      },
    ]
  }
}

module.exports = frameworkStepToSummary
