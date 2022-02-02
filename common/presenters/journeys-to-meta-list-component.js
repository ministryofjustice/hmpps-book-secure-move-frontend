const { sortBy } = require('lodash')

const i18n = require('../../config/i18n')

function _mapJourney({
  state,
  from_location: fromLocation,
  to_location: toLocation,
  date,
  vehicle,
} = {}) {
  const rows = [
    {
      classes: 'govuk-!-font-size-16',
      key: {
        text: i18n.t('moves::map.labels.route.heading'),
      },
      value: {
        text: i18n.t('moves::map.labels.route.text', {
          from: fromLocation.title,
          to: toLocation.title,
        }),
      },
    },
    {
      classes: 'govuk-!-font-size-16',
      key: {
        text: i18n.t('moves::map.labels.date.heading'),
      },
      value: {
        text: i18n.t('moves::map.labels.date.text', {
          context: date ? '' : 'unknown',
          date,
        }),
      },
    },
    {
      classes: 'govuk-!-font-size-16',
      key: {
        text: i18n.t('moves::map.labels.vehicle.heading'),
      },
      value: {
        html: i18n.t('moves::map.labels.vehicle.text', {
          context: vehicle ? '' : 'unknown',
          registration: vehicle?.registration,
          id: vehicle?.id,
        }),
      },
    },
  ]

  let tagClass = ''

  switch (state) {
    case 'rejected':
      tagClass = 'govuk-tag--red'
      break
    case 'cancelled':
      tagClass = 'govuk-tag--red'
      break
    case 'in_progress':
      tagClass = 'govuk-tag--yellow'
      break
    case 'completed':
      tagClass = 'govuk-tag--green'
      break
    default:
      break
  }

  return {
    tag: {
      text: state,
      classes: `govuk-!-font-size-14 ${tagClass}`,
      attributes: {
        style: 'padding: 2px 5px',
      },
    },
    metaList: {
      classes: 'app-meta-list',
      items: rows,
    },
  }
}

function journeysToMetaListComponent(journeys = []) {
  return sortBy(journeys, 'timestamp').map(_mapJourney)
}

module.exports = journeysToMetaListComponent
