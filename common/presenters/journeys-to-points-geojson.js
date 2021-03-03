const { reduce, uniqBy, find } = require('lodash')

module.exports = function journeysToPointsGeoJSON({
  journeys,
  locationLookup = [],
}) {
  let locationsInJourneys = reduce(
    journeys,
    (acc, journey) => {
      acc.push(journey.from_location)
      acc.push(journey.to_location)
      return acc
    },
    []
  )

  locationsInJourneys = uniqBy(locationsInJourneys, 'id')

  const locationsWithCoords = reduce(
    locationsInJourneys,
    (acc, location) => {
      if (location.latitude && location.longitude) {
        acc.push(location)
      } else {
        const foundLocation = find(locationLookup, { id: location.id })

        if (foundLocation) {
          acc.push(foundLocation)
        }
      }

      return acc
    },
    []
  )

  const features = locationsWithCoords.map(location => {
    return {
      type: 'Feature',
      id: location.id,
      properties: {
        '@id': location.id,
        name: location.title,
      },
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
    }
  })

  return {
    type: 'FeatureCollection',
    features,
  }
}
