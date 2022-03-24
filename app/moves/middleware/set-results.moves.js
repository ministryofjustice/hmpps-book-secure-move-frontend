const { omitBy, isUndefined } = require('lodash')

const presenters = require('../../../common/presenters')

function setResultsMoves(bodyKey, locationKey) {
  return async function handleResults(req, res, next) {
    const { group_by: groupBy } = req.query

    try {
      if (!req.location) {
        return next()
      }

      const args = omitBy(req.body[bodyKey], isUndefined)
      const activeMoves = await req.services.move.getActive(args)

      for (let i = 0; i < activeMoves.length; i++) {
        const move = activeMoves[i]
        const eventsForMove = await req.services.move.getByIdWithEvents(move.id)
        move.timeline_events = eventsForMove.timeline_events
      }

      if (groupBy === 'vehicle') {
        req.resultsAsCards = presenters.movesByVehicle({
          moves: activeMoves,
          context: locationKey === 'from_location' ? 'incoming' : 'outgoing',
          showLocations: !req.location,
          locationType: req.location.location_type,
        })
      } else {
        req.resultsAsCards = presenters.movesByLocation(
          activeMoves,
          locationKey,
          req.location.location_type
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setResultsMoves
