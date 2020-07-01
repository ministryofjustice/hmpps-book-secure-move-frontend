const { filter } = require('lodash')

const i18n = require('../../config/i18n')

function frameworkStepToSummary(allFields, baseUrl) {
  return ([key, step]) => {
    const stepUrl = `${baseUrl}/${step.slug}`
    const stepFields = step.fields
    const answerQuestionText = i18n.t('actions::answer_question')

    if (!stepFields.length) {
      return undefined
    }

    const summaryListRows = stepFields.map(fieldName => {
      const { id, description, question } = allFields[fieldName] || {}
      const rowHeader = description || question

      if (!rowHeader) {
        return undefined
      }

      return {
        key: {
          text: rowHeader,
          classes: 'govuk-!-font-weight-regular',
        },
        value: {
          html: `<a href="${stepUrl}#${id}">${answerQuestionText}</a>`,
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
