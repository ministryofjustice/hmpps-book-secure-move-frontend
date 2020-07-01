const i18n = require('../../config/i18n')

function frameworkStepToSummary(fields, baseUrl) {
  return ([key, step]) => {
    const stepUrl = `${baseUrl}/${step.slug}`
    const answerQuestionText = i18n.t('actions::answer_question')
    const summaryListComponent = step.fields.map(field => {
      const { id, description, question } = fields[field]
      return {
        key: {
          text: description || question,
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
        summaryListComponent,
      },
    ]
  }
}

module.exports = frameworkStepToSummary
