const { get, groupBy, sortBy } = require('lodash')

const i18n = require('../../config/i18n')

const moveToCardComponent = require('./move-to-card-component')

function _emptyToLocation(move) {
  if (move.to_location) {
    return move
  }

  const hasOwnLabel = ['prison_recall', 'video_remand']

  return {
    ...move,
    to_location: {
      key: `unknown__${move.move_type}`,
      title: hasOwnLabel.includes(move.move_type)
        ? i18n.t(`fields::move_type.items.${move.move_type}.label`)
        : i18n.t('fields::move_type.items.unknown.label'),
    },
  }
}

module.exports = function movesByLocation(
  data,
  locationKey = 'to_location',
  cardTagSource
) {
  const locations = []
  const groupedByLocation = groupBy(
    data.map(_emptyToLocation),
    `${locationKey}.key`
  )

  Object.entries(groupedByLocation).forEach(([locationId, moves]) => {
    locations.push({
      items: moves.map(
        moveToCardComponent({
          tagSource: cardTagSource,
        })
      ),
      label: i18n.t(`collections::labels.${locationKey}`),
      location: get(moves[0], `${locationKey}.title`),
    })
  })

  return sortBy(locations, 'location')
}
