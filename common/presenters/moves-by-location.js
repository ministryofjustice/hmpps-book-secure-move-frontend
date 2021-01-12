const { groupBy, sortBy } = require('lodash')

const i18n = require('../../config/i18n')

const moveToCardComponent = require('./move-to-card-component')

module.exports = function movesByLocation({
  moves: data,
  locationKey = 'to_location',
  locationType,
  showLocations = false,
}) {
  const locations = []
  const groupedByLocation = groupBy(data, `${locationKey}.title`)

  Object.entries(groupedByLocation).forEach(([location, moves]) => {
    locations.push({
      sortKey: location,
      items: sortBy(moves, 'profile.person._fullname').map(
        moveToCardComponent({
          locationType,
          showToLocation: locationKey === 'from_location' && showLocations,
          showFromLocation: locationKey === 'to_location' && showLocations,
        })
      ),
      header: [
        {
          label: i18n.t(`collections::labels.${locationKey}`),
          value: location,
        },
      ],
    })
  })

  return sortBy(locations, location => location?.sortKey?.toUpperCase())
}
