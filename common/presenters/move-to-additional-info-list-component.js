const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function moveToAdditionalInfoListComponent({
  move_type: moveType,
  time_due: timeDue,
  additional_information: additionalInformation,
} = {}) {
  const rows = [
    {
      key: {
        text: i18n.t('fields::time_due.label', {
          context: moveType,
        }),
      },
      value: {
        text: filters.formatTime(timeDue),
      },
    },
    {
      key: {
        text: i18n.t('fields::additional_information.display.label', {
          context: moveType,
        }),
      },
      value: {
        html: additionalInformation,
      },
    },
  ]

  return {
    classes: 'govuk-!-font-size-16',
    rows: rows.filter(row => row.value.text || row.value.html),
  }
}

module.exports = moveToAdditionalInfoListComponent
