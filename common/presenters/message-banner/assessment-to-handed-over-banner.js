const i18n = require('../../../config/i18n')
const filters = require('../../../config/nunjucks/filters')
const componentService = require('../../services/component')

module.exports = function assessmentToHandedOverBanner({
  assessment,
  baseUrl,
  canAccess,
  context,
} = {}) {
  if (!assessment) {
    return {}
  }

  let content = `
    <p>
      ${i18n.t('messages::assessment.handed_over.content', {
        context,
        date: filters.formatDateWithTimeAndDay(assessment.handover_occurred_at),
        details: assessment.handover_details,
      })}
    </p>

    ${componentService.getComponent('govukWarningText', {
      html: i18n.t('messages::assessment.handed_over.warning', {
        details: assessment.handover_details,
      }),
      iconFallbackText: 'Warning',
    })}
    `

  if (canAccess && canAccess(`${context}:print`)) {
    content += `
      <p>
        <a href="${baseUrl}/print" class="app-icon app-icon--print">
          ${i18n.t('actions::print_assessment', {
            context,
          })}
        </a>
      </p>
    `
  }

  content += `
    <p class="govuk-!-font-size-16 govuk-!-margin-top-1">
      ${i18n.t('handed_over_at', {
        date: filters.formatDateWithTimeAndDay(
          assessment.handover_occurred_at,
          true
        ),
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
