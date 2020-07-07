const { filter, flatten } = require('lodash')

const frameworksHelpers = require('../helpers/frameworks')

const frameworkFieldToSummaryListRow = require('./framework-field-summary-list-row')

function frameworkStepToSummary(allFields, responses, baseUrl) {
  return ([key, step]) => {
    const stepUrl = `${baseUrl}/${step.slug}`
    const stepFields = step.fields

    if (!stepFields.length) {
      return
    }

    const summaryListRows = stepFields
      .map(frameworksHelpers.mapFieldFromName(allFields))
      .map(frameworksHelpers.appendResponseToField(responses))
      .map(frameworkFieldToSummaryListRow(stepUrl))

    return [
      key,
      {
        ...step,
        stepUrl,
        summaryListComponent: {
          classes: 'govuk-!-font-size-16',
          rows: filter(flatten(summaryListRows)),
        },
      },
    ]
  }
}

module.exports = frameworkStepToSummary
