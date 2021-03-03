const moveHelpers = require('../../../../common/helpers/move')
const journeysToSummaryList = require('../../../../common/presenters/journeys-to-meta-list-component')
const {
  MAPPING: { TILE_URL: tileUrl },
} = require('../../../../config')
const i18n = require('../../../../config/i18n')

module.exports = function map(req, res) {
  const journeySummary = journeysToSummaryList(req.journeys, req.user.locations)

  const locals = {
    ...moveHelpers.getLocals(req),
    journeySummary: journeySummary,
    tileUrl: tileUrl,
    finalJourney: req.journeys && req.journeys[req.journeys.length - 1],
    locationsUrl: `/move/${req.move.id}/map/locations.geo.json`,
    journeysUrl: `/move/${req.move.id}/map/journeys.geo.json`,
    mapErrorMessage: i18n.t('moves::map.map_error'),
  }

  res.render('move/views/map', locals)
}
