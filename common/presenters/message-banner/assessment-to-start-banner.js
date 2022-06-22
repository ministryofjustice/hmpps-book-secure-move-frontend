const i18n = require('../../../config/i18n').default
const componentService = require('../../services/component')

module.exports = function assessmentToStartBanner({
  baseUrl,
  canAccess,
  context,
} = {}) {
  let content = `
    <p>
      ${i18n.t('messages::assessment.pending.content', { context })}
    </p>
  `

  if (canAccess && canAccess(`${context}:create`)) {
    content += `
      ${componentService.getComponent('govukButton', {
        href: `${baseUrl}/new`,
        text: i18n.t('actions::start_assessment', { context }),
      })}
    `
  }

  return {
    allowDismiss: false,
    classes: 'app-message--instruction govuk-!-padding-right-0',
    title: {
      text: i18n.t('messages::assessment.pending.heading', { context }),
    },
    content: {
      html: content,
    },
  }
}
