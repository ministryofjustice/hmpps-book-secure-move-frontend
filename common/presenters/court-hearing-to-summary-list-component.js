const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

module.exports = function courtHearingsToSummaryListComponent({
  comments,
  start_time: startTime,
  case_number: caseNumber,
  case_type: caseType,
  case_start_date: caseStartDate,
} = {}) {
  const startedOn = i18n.t('moves::detail.court_hearing.started_on', {
    datetime: filters.formatDate(caseStartDate, 'yyyy-MM-dd'),
    datestring: filters.formatDate(caseStartDate),
  })
  const startedOnString = caseStartDate ? ` (${startedOn})` : ''

  const rows = [
    {
      key: {
        text: i18n.t('moves::detail.court_hearing.time_of_hearing'),
      },
      value: {
        html: startTime
          ? `<time datetime="${startTime}">${filters.formatTime(
              startTime
            )}</time>`
          : undefined,
      },
    },
    {
      key: {
        text: i18n.t('moves::detail.court_hearing.case_number'),
      },
      value: {
        html: caseNumber ? caseNumber + startedOnString : undefined,
      },
    },
    {
      key: {
        text: i18n.t('moves::detail.court_hearing.case_type'),
      },
      value: {
        text: caseType,
      },
    },
    {
      key: {
        text: i18n.t('moves::detail.court_hearing.comments'),
      },
      value: {
        text: comments,
      },
    },
  ]

  return {
    classes: 'govuk-!-margin-bottom-2 govuk-!-font-size-16',
    rows: rows.filter(row => row.value.text || row.value.html),
  }
}
