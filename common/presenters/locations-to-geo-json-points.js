module.exports = function locationsToGeoJsonPoints(locations) {
  const features = locations
    .filter(location => location.latitude && location.longitude)
    .map(location => {
      return {
        type: 'Feature',
        id: location.id,
        properties: {
          '@id': location.id,
          name: location.title,
          isOrigin: location.start === true,
          isFinalDestination: location.end === true,
        },
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      }
    })

  return features
}
