const { filter, find, flatten, isArray } = require('lodash')

const frameworksHelpers = require('../helpers/frameworks')

const frameworkFieldToSummaryListRow = require('./framework-field-summary-list-row')

function frameworkStepToSummary(
  allFields,
  responses,
  baseUrl = '',
  editPermission = false
) {
  return ([key, step], i, allSteps = []) => {
    const allNextSteps = allSteps
      .map(([key, step]) => step.next)
      .filter(next => isArray(next))
      .reduce((acc, it) => [...it, ...acc], [])
    const unmetStepConditions = allNextSteps
      .filter(condition => condition.next === step.slug)
      .filter(item => {
        const response = find(responses, ['question.key', item.field]) || {}
        return item.value !== response.value
      })

    const stepUrl = baseUrl + step.slug
    const stepFields = step.fields

    if (stepFields.length === 0 || unmetStepConditions.length > 0) {
      return
    }

    const summaryListRows = stepFields
      .map(frameworksHelpers.mapFieldFromName(allFields))
      .map(frameworksHelpers.appendResponseToField(responses))
      .map(frameworkFieldToSummaryListRow(stepUrl, editPermission))

    return [
      key,
      {
        ...step,
        stepUrl,
        summaryListComponent: {
          classes: 'govuk-!-margin-bottom-0 govuk-!-font-size-16',
          rows: filter(flatten(summaryListRows)),
        },
      },
    ]
  }
}

module.exports = frameworkStepToSummary
