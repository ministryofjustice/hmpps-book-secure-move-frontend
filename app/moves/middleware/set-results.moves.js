const { omitBy, isUndefined } = require('lodash')

const presenters = require('../../../common/presenters')

function setResultsMoves(bodyKey, locationKey) {
  return async function handleResults(req, res, next) {
    const { group_by: groupBy } = req.query

    const currentLocation =
      req.session?.currentLocation || req.params?.locationId

    try {
      if (!currentLocation) {
        return next()
      }

      const args = omitBy(req.body[bodyKey], isUndefined)

      const activeMoves = await req.services.move.getActive(args)

      if (groupBy === 'vehicle') {
        req.resultsAsCards = presenters.movesByVehicle({
          moves: activeMoves,
          context: locationKey === 'from_location' ? 'incoming' : 'outgoing',
          showLocations: !currentLocation,
        })
      } else {
        req.resultsAsCards = presenters.movesByLocation(
          activeMoves,
          locationKey
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setResultsMoves
