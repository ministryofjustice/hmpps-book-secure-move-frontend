const { filter, flatten, isEmpty } = require('lodash')

const componentService = require('../services/component')

function frameworkFieldToSummaryListRow(stepUrl, extraClasses = []) {
  return field => {
    const { description, id, response, question } = field
    const headerText = description || question
    const classes = ['govuk-!-font-weight-regular', ...extraClasses].join(' ')
    const responseHtml = componentService.getComponent('appFrameworkResponse', {
      value: isEmpty(response.value) ? undefined : response.value,
      valueType: response.value_type,
      responded: response.responded === true,
      questionUrl: `${stepUrl}#${id}`,
      classes: 'govuk-!-font-size-16',
    })

    const row = {
      key: {
        classes,
        text: headerText,
      },
      value: {
        html: responseHtml,
      },
    }

    if (!field.items) {
      return [row]
    }

    const followupRows = field.items
      .filter(item => item.followup)
      .filter(item => item.value === field.response.value)
      .map(item =>
        item.followup.map(
          frameworkFieldToSummaryListRow(stepUrl, ['govuk-!-padding-left-5'])
        )
      )

    return filter(flatten([row, ...flatten(followupRows)]))
  }
}

module.exports = frameworkFieldToSummaryListRow
