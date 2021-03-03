const centrePoint = { latitude: 53.825564, longitude: -2.421976 }

const { reduce, map, find } = require('lodash')

const getLocationCoordinates = function ({
  location,
  locationLookup,
  useCentrePointFillIn,
}) {
  if (location.longitude && location.latitude) {
    return { longitude: location.longitude, latitude: location.latitude }
  }

  const foundLocation = find(locationLookup, { id: location?.id })

  if (foundLocation?.longitude && foundLocation?.latitude) {
    return {
      longitude: foundLocation.longitude,
      latitude: foundLocation.latitude,
    }
  }

  if (useCentrePointFillIn) {
    return centrePoint
  }

  return undefined
}

module.exports = function journeysToPointsGeoJSON({
  journeys,
  locationLookup = [],
  useCentrePointFillIn = false,
}) {
  // Decorate with Coordinates
  const journeysWithCoords = map(journeys, journey => {
    const fromLocationCoords = getLocationCoordinates({
      location: journey.from_location,
      locationLookup,
      useCentrePointFillIn,
    })

    const toLocationCoords = getLocationCoordinates({
      location: journey.to_location,
      locationLookup,
      useCentrePointFillIn,
    })

    return {
      ...journey,
      to_location: { ...journey.to_location, ...toLocationCoords },
      from_location: { ...journey.fromLocation, ...fromLocationCoords },
    }
  })

  // Strip missing coordinates
  const cleanedLocations = reduce(
    journeysWithCoords,
    (acc, journey) => {
      if (
        journey.from_location?.latitude &&
        journey.from_location?.longitude &&
        journey.to_location?.latitude &&
        journey.to_location?.longitude
      ) {
        acc.push(journey)
      }

      return acc
    },
    []
  )

  // Render as Features
  const features = cleanedLocations.map(journey => {
    return {
      type: 'Feature',
      id: journey.id,
      properties: {
        '@id': journey.id,
        vehicle_registration: journey.vehicle?.registration || '',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [journey.from_location.longitude, journey.from_location.latitude],
          [journey.to_location.longitude, journey.to_location.latitude],
        ],
      },
    }
  })

  return {
    type: 'FeatureCollection',
    features,
  }
}
