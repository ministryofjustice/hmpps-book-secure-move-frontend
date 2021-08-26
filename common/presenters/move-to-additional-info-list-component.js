const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function moveToAdditionalInfoListComponent({
  move_type: moveType,
  time_due: timeDue,
  additional_information: additionalInformation,
} = {}) {
  if (!['hospital', 'prison_recall', 'video_remand'].includes(moveType)) {
    return undefined
  }

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
        classes: !additionalInformation ? 'app-secondary-text-colour' : '',
        html: additionalInformation || i18n.t('not_provided'),
      },
    },
  ].filter(row => row.value.text || row.value.html)

  return {
    classes: 'govuk-!-font-size-16',
    count: rows.length,
    key: moveType,
    heading: i18n.t('moves::detail.additional_information.heading', {
      context: moveType,
    }),
    rows,
  }
}

module.exports = moveToAdditionalInfoListComponent
