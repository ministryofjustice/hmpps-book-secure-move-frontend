const i18n = require('../../../config/i18n')
const filters = require('../../../config/nunjucks/filters')
const componentService = require('../../services/component')

module.exports = function assessmentToHandedOverBanner({
  assessment,
  baseUrl,
  context,
} = {}) {
  if (!assessment) {
    return {}
  }

  const content = `
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

    <p>
      <a href="${baseUrl}/print" class="app-icon app-icon--print">
        ${i18n.t('actions::print_assessment', {
          context,
        })}
      </a>

      <p class="app-icon app-print--hide">
        ${i18n.t('messages::assessment.handed_over.note', {
          context,
          date: filters.formatDateWithTimeAndDay(
            assessment.handover_occurred_at
          ),
          details: assessment.handover_details,
        })}
      </p>

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
