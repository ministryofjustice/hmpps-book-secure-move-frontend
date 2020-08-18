const { find, filter, flatten, flattenDeep, isEmpty } = require('lodash')

const i18n = require('../../config/i18n')
const componentService = require('../services/component')

function frameworkFieldToSummaryListRow(stepUrl) {
  return field => {
    const { description, id, response, question, descendants, itemName } = field
    const headerText = description || question

    if (response.value_type === 'collection::add_multiple_items') {
      const rows = response.value.map((item, index) => {
        const responsesHtml = descendants
          .map(f => {
            const q =
              find(response.question.descendants, {
                key: f.name,
              }) || {}
            const r = find(item.responses, { framework_question_id: q.id })

            return {
              ...f,
              response: {
                ...r,
                value_type: q.response_type,
              },
            }
          })
          .map(frameworkFieldToSummaryListRow(stepUrl))

        return [
          {
            key: {
              classes: 'govuk-!-font-size-19',
              text: `${itemName || i18n.t('item')} ${index + 1}`,
            },
          },
          ...responsesHtml,
        ]
      })

      return flattenDeep(rows)
    }

    const responseHtml = componentService.getComponent('appFrameworkResponse', {
      value: isEmpty(response.value) ? undefined : response.value,
      valueType: response.value_type,
      responded: response.responded === true,
      questionUrl: `${stepUrl}#${id}`,
      classes: 'govuk-!-font-size-16',
    })

    const row = {
      key: {
        classes: 'govuk-!-font-weight-regular',
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
      .map(item => item.followup.map(frameworkFieldToSummaryListRow(stepUrl)))

    return filter(flatten([row, ...flatten(followupRows)]))
  }
}

module.exports = frameworkFieldToSummaryListRow
