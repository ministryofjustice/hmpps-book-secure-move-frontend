module.exports = function journeysToGeoJsonLines(journeys) {
  // Render as Features
  const features = journeys
    .filter(location => {
      return (
        location.from_location.latitude &&
        location.from_location.longitude &&
        location.to_location.latitude &&
        location.to_location.longitude
      )
    })
    .map(journey => {
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

  return features
}
