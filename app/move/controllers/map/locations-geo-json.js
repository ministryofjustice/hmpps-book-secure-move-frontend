const journeysToPointsGeoJSON = require('../../../../common/presenters/journeys-to-points-geojson')

module.exports = (req, res) => {
  const pointsGeoJSON = journeysToPointsGeoJSON({
    journeys: req.journeys,
    locationLookup: req.user.locations,
  })

  res.status(200)
  res.json(pointsGeoJSON)
}
