const { map } = require('lodash')

const journeysToGeoJsonLines = require('../../../common/presenters/journeys-to-geo-json-lines')
const journeysToSummaryList = require('../../../common/presenters/journeys-to-meta-list-component')
const locationsToGeoJsonPoints = require('../../../common/presenters/locations-to-geo-json-points')
const {
  MAPPING: { TILE_URL: tileUrl },
} = require('../../../config')

module.exports = function mapController(req, res) {
  const moveLocations = [
    { ...req.move.from_location, start: true },
    { ...req.move.to_location, end: true },
    ...map(req.journeys, 'from_location'),
    ...map(req.journeys, 'to_location'),
  ]
  const pointsGeoJSON = locationsToGeoJsonPoints(moveLocations.flat())
  const linesGeoJSON = journeysToGeoJsonLines(req.journeys)

  const locals = {
    move: req.move,
    journeys: journeysToSummaryList(req.journeys),
    geoData: {
      points: JSON.stringify(pointsGeoJSON),
      lines: JSON.stringify(linesGeoJSON),
    },
    tileUrl,
  }

  res.render('move/views/journeys', locals)
}
