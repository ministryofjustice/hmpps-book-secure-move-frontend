const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function moveToSummaryListComponent({
  date,
  time_due: timeDue,
  move_type: moveType,
  from_location: fromLocation,
  to_location: toLocation,
} = {}) {
  const pickup = fromLocation?.title

  const rows = [
    {
      key: {
        text: i18n.t('fields::from_location.label'),
      },
      value: {
        text: pickup,
      },
    },
    {
      key: {
        text: i18n.t('fields::to_location.label'),
      },
      value: {
        text: pickup ? toLocation?.title : undefined,
      },
    },
    {
      key: {
        text: i18n.t('fields::date_custom.label'),
      },
      value: {
        text: filters.formatDateWithDay(date),
      },
    },
    {
      key: {
        text: i18n.t('fields::time_due.label'),
      },
      value: {
        text: filters.formatTime(timeDue),
      },
    },
  ]

  return {
    classes: 'govuk-!-font-size-16',
    rows: rows.filter(row => row.value.text || row.value.html),
  }
}

module.exports = moveToSummaryListComponent
