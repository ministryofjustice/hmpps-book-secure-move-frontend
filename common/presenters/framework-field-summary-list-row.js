const { find, filter, flattenDeep, isEmpty } = require('lodash')

const i18n = require('../../config/i18n')
const componentService = require('../services/component')

function frameworkFieldToSummaryListRow(stepUrl) {
  return field => {
    const { description, id, response, question, descendants, itemName } = field
    const headerText = description || question
    const valueType = response.question?.response_type

    if (
      valueType === 'collection::add_multiple_items' &&
      response.value.length > 0
    ) {
      const rows = response.value.map((item, index) => {
        const responsesHtml = descendants
          .map(descendantField => {
            const frameworkQuestion = find(response.question.descendants, {
              key: descendantField.name,
            })
            const descendantResponse = find(item.responses, {
              framework_question_id: frameworkQuestion.id,
            })

            return {
              ...descendantField,
              response: {
                ...descendantResponse,
                question: frameworkQuestion,
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
      valueType,
      responded: response.responded === true,
      questionUrl: `${stepUrl}#${id}`,
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

    return filter(flattenDeep([row, ...followupRows]))
  }
}

module.exports = frameworkFieldToSummaryListRow
