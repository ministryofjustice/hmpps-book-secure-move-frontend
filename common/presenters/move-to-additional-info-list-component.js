const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')
const mapUpdateLink = require('../helpers/move/map-update-link')

function moveToAdditionalInfoListComponent(
  {
    move_type: moveType,
    time_due: timeDue,
    additional_information: additionalInformation,
    recall_date: recallDate,
  } = {},
  updateUrls = []
) {
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
        text: additionalInformation || i18n.t('not_provided'),
      },
      updateJourneyKey: 'move',
    },
    {
      key: {
        text: i18n.t('recall_date', {
          context: moveType,
        }),
      },
      value: {
        classes: !recallDate ? 'app-secondary-text-colour' : '',
        text: filters.formatDateWithRelativeDay(recallDate),
      },
      updateJourneyKey: 'recall_info',
    },
  ]
    .filter(row => row.value.text || row.value.html)
    .map(row => {
      if (!updateUrls[row.updateJourneyKey]) {
        return row
      }

      return {
        ...row,
        actions: {
          items: [
            mapUpdateLink(
              updateUrls[row.updateJourneyKey],
              row.updateJourneyKey
            ),
          ],
        },
      }
    })

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
