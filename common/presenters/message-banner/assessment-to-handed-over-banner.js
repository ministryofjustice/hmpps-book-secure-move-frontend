const { isEmpty } = require('lodash')

const i18n = require('../../../config/i18n')
const filters = require('../../../config/nunjucks/filters')
const componentService = require('../../services/component')
const assessmentPrintButton = require('../assessment-print-button')

module.exports = function assessmentToHandedOverBanner({
  assessment,
  baseUrl,
  canAccess,
  context,
} = {}) {
  if (!assessment) {
    return {}
  }

  const {
    handover_details: handoverDetails,
    handover_occurred_at: handoverOccurredAt,
  } = assessment

  let content = ''

  if (!isEmpty(handoverDetails)) {
    content += `
      <p>
        ${i18n.t('messages::assessment.handed_over.content', {
          context,
          date: filters.formatDateWithTimeAndDay(handoverOccurredAt),
          details: handoverDetails,
        })}
      </p>

      ${componentService.getComponent('govukWarningText', {
        html: i18n.t('messages::assessment.handed_over.warning', {
          details: handoverDetails,
        }),
        iconFallbackText: 'Warning',
      })}
     `
  }

  content += assessmentPrintButton({ baseUrl, canAccess, context })

  content += `
    <p class="govuk-!-font-size-16 govuk-!-margin-top-1">
      ${i18n.t('handed_over_at', {
        date: filters.formatDateWithTimeAndDay(handoverOccurredAt, true),
      })}
    </p>
  `

  return {
    allowDismiss: false,
    classes: 'app-message--instruction govuk-!-padding-right-0',
    title: {
      text: i18n.t('messages::assessment.handed_over.heading', {
        context,
      }),
    },
    content: {
      html: content,
    },
  }
}
