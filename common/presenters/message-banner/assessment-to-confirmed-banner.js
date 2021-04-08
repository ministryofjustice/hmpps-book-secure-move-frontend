const i18n = require('../../../config/i18n')
const filters = require('../../../config/nunjucks/filters')
const assessmentPrintButton = require('../assessment-print-button')

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

  content += assessmentPrintButton({ baseUrl, canAccess, context })

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
