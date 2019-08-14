const { get, groupBy, sortBy } = require('lodash')

const i18n = require('../../config/i18n')
const moveToCardComponent = require('./move-to-card-component')

function _emptyToLocation(move) {
  if (move.to_location) {
    return move
  }

  return {
    ...move,
    to_location: {
      key: `unknown__${move.move_type}`,
      title:
        move.move_type === 'prison_recall'
          ? i18n.t('fields::move_type.items.prison_recall.label')
          : i18n.t('fields::move_type.items.unknown.label'),
    },
  }
}

module.exports = function movesByToLocation(data) {
  const locations = []
  const groupedByLocation = groupBy(
    data.map(_emptyToLocation),
    'to_location.key'
  )

  Object.entries(groupedByLocation).forEach(([locationId, moves]) => {
    locations.push({
      items: moves.map(moveToCardComponent),
      location: get(moves[0], 'to_location.title'),
    })
  })

  return sortBy(locations, 'location')
}
