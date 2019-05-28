const { groupBy, sortBy } = require('lodash')

const moveToCardComponent = require('./move-to-card-component')

module.exports = function movesByToLocation (data) {
  const locations = []
  const groupedByLocation = groupBy(data, 'to_location.id')

  Object.entries(groupedByLocation).forEach(([locationId, items]) => {
    locations.push({
      location: items[0].to_location,
      items: items.map(moveToCardComponent),
    })
  })

  return sortBy(locations, 'location.description')
}
