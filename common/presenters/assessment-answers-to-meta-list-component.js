const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function _mapAnswer({
  comments,
  created_at: createdAt,
  nomis_alert_description: description,
}) {
  let html = ''

  if (description) {
    html = `
      <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">
        ${description}
      </h4>
    `
  }

  html +=
    comments ||
    `<span class="app-secondary-text-colour">${i18n.t('empty_details')}</span>`

  if (description && createdAt) {
    html += `
      <div class="app-secondary-text-colour govuk-!-margin-top-2 govuk-!-font-size-14">
        ${i18n.t('created_on')} ${filters.formatDateWithDay(createdAt)}
      </div>
    `
  }

  return {
    value: {
      html: `<div>${html}</div>`,
    },
  }
}

function assessmentAnswersToMetaListComponent(answers = []) {
  return {
    classes: 'app-meta-list--divider govuk-!-font-size-16',
    items: answers.map(_mapAnswer),
  }
}

module.exports = assessmentAnswersToMetaListComponent
