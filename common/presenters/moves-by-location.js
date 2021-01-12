const { get, groupBy, sortBy } = require('lodash')

const i18n = require('../../config/i18n')

const moveToCardComponent = require('./move-to-card-component')

module.exports = function movesByLocation(data, locationKey = 'to_location') {
  const locations = []
  const groupedByLocation = groupBy(data, `${locationKey}.key`)

  Object.entries(groupedByLocation).forEach(([locationId, moves]) => {
    locations.push({
      items: moves.map(moveToCardComponent()),
      label: i18n.t(`collections::labels.${locationKey}`),
      location: get(moves[0], `${locationKey}.title`),
    })
  })

  return sortBy(locations, 'location')
}
