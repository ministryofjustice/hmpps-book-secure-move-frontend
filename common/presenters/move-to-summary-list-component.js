const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const mapUpdateLink = require('../helpers/move/map-update-link')

/**
 * Convert a move into the structure required to render
 * as a `govukSummaryList` component
 *
 * @param {Object} move - the move to format
 *
 * @param {Object} [options] - config options for the presenter
 * @param {Object} [options.updateUrls={}] - object containing URLs for each edit step
 *
 * @returns {Object} - a move formatted as a `govukSummaryList` component
 */
function moveToSummaryListComponent(
  {
    date,
    time_due: timeDue,
    move_type: moveType,
    from_location: fromLocation,
    to_location: toLocation,
  } = {},
  { updateUrls = {} } = {}
) {
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
      updateJourneyKey: 'move',
    },
    {
      key: {
        text: i18n.t('fields::date_custom.label'),
      },
      value: {
        text: filters.formatDateWithDay(date),
      },
      updateJourneyKey: 'date',
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
    rows,
  }
}

module.exports = moveToSummaryListComponent
