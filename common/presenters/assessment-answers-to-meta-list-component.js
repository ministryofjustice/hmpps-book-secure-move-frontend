const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function generateDateHtmlString({
  startDate,
  endDate,
  startDateKey = 'started_on',
  endDateKey = 'and_ended_on',
  codeType,
}) {
  if (startDate) {
    return `
      <div class="app-secondary-text-colour govuk-!-margin-top-2 govuk-!-font-size-14">
        ${i18n.t(startDateKey, {
          context: codeType,
        })} ${filters.formatDateWithDay(startDate)}
        ${
          endDate
            ? `${i18n.t(endDateKey)} ${filters.formatDateWithDay(endDate)}`
            : ''
        }
      </div>
    `
  }
}

function _mapAnswer({
  comments,
  created_at: createdAt,
  creation_date: creationDate,
  start_date: startDate,
  end_date: endDate,
  approval_date: approvalDate,
  next_review_date: nextReviewDate,
  nomis_alert_description: nomisAlertDescription,
  code_type: codeType,
  code_description: codeDescription,
}) {
  const description = nomisAlertDescription || codeDescription
  const created = createdAt || creationDate
  let html = ''

  if (description) {
    html = `
      <h4 class="govuk-heading-s govuk-!-font-size-16 govuk-!-margin-top-0 govuk-!-margin-bottom-2">
        ${description}
      </h4>
    `
  }

  html += comments
    ? `<span class="app-!-text-colour-black">${comments}</span>`
    : `<span class="app-secondary-text-colour">${i18n.t(
        'empty_details'
      )}</span>`

  if (description && created) {
    html += generateDateHtmlString({
      startDate: created,
      startDateKey: 'created_on',
      codeType,
    })
  }

  if (startDate) {
    html += generateDateHtmlString({ startDate, endDate, codeType })
  }

  if (approvalDate) {
    html += generateDateHtmlString({
      startDate: approvalDate,
      endDate: nextReviewDate,
      startDateKey: 'approved_on',
      endDateKey: 'and_next_review_on',
      codeType,
    })
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
