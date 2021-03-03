const journeysToLineStringsGeoJSON = require('../../../../common/presenters/journeys-to-linestrings-geojson')

module.exports = (req, res) => {
  const linesGeoJSON = journeysToLineStringsGeoJSON({
    journeys: req.journeys,
    locationLookup: req.user.locations,
    useCentrePointFillIn: true,
  })

  res.status(200)
  res.json(linesGeoJSON)
}
