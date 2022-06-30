const i18n = require('../../config/i18n').default

module.exports = function assessmentPrintbutton({
  baseUrl,
  canAccess,
  context,
} = {}) {
  if (canAccess && canAccess(`${context}:print`)) {
    return `
      <p>
        <a href="${baseUrl}/print" class="app-icon app-icon--print">
          ${i18n.t('actions::print_assessment', {
            context,
          })}
        </a>
      </p>
    `
  }

  return ''
}
