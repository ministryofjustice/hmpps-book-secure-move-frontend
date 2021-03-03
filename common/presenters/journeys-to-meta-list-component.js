const { find, flatten } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function _mapJourney({
  state,
  timestamp: date,
  from_location: fromLocation,
  to_location: toLocation,
  vehicle,
  locationsLookup,
} = {}) {
  const start =
    fromLocation?.title ||
    find(locationsLookup, ['id', fromLocation.id])?.title ||
    'Unknown'

  const finish =
    toLocation?.title ||
    find(locationsLookup, ['id', toLocation.id])?.title ||
    'Unknown'

  const startValue = i18n.t('moves::map.categories.start.message', {
    context: state,
    location: start,
  })
  const finishValue = i18n.t('moves::map.categories.finish.message', {
    context: state,
    location: finish,
  })

  const rows = [
    {
      classes: 'govuk-!-font-size-16',
      key: {
        text: i18n.t('moves::map.categories.date.heading'),
      },
      value: {
        text: filters.formatDateWithTimeAndDay(date),
      },
    },
    {
      classes: 'govuk-!-font-size-16',
      key: {
        text: i18n.t('moves::map.categories.start.heading'),
      },
      value: {
        html: startValue,
      },
    },
    {
      classes: 'govuk-!-font-size-16',
      key: {
        text: i18n.t('moves::map.categories.finish.heading'),
      },
      value: {
        html: finishValue,
      },
    },
    {
      classes: 'govuk-!-font-size-16',
      key: {
        text: i18n.t('moves::map.categories.state.heading'),
      },
      value: {
        text: state,
      },
    },
    {
      classes: 'govuk-!-font-size-16',
      key: {
        text: i18n.t('moves::map.categories.vehicle.heading'),
      },
      value: {
        text: vehicle?.registration,
      },
    },
  ]

  return rows
}

function journeysToMetaListComponent(journeys = [], locationsLookup) {
  const items = journeys
    .map(item => ({ ...item, locationsLookup }))
    .map(_mapJourney)

  return {
    classes: 'app-meta-list',
    items: flatten(items),
  }
}

module.exports = journeysToMetaListComponent
