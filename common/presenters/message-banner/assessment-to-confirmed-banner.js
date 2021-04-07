const i18n = require('../../../config/i18n')
const filters = require('../../../config/nunjucks/filters')

module.exports = function assessmentToConfirmedBanner({
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
      ${i18n.t(`messages::assessment.${assessment.status}.content`, {
        context,
        date: filters.formatDateWithTimeAndDay(assessment.confirmed_at),
      })}
    </p>
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

  return {
    allowDismiss: false,
    classes: 'app-message--instruction govuk-!-padding-right-0',
    title: {
      text: i18n.t(`messages::assessment.${assessment.status}.heading`, {
        context,
      }),
    },
    content: {
      html: content,
    },
  }
}
