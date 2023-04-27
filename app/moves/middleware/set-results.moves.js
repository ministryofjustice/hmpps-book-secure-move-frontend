const { omitBy, isUndefined } = require('lodash')

const {
  canEditAssessment,
} = require('../../../common/helpers/move/can-edit-assessment')
const { canEditMove } = require('../../../common/helpers/move/can-edit-move')
const { isPerLocked } = require('../../../common/helpers/move/is-per-locked')
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
      activeMoves.forEach(move => {
        move._canEdit = canEditMove(move, req.canAccess)
        move._isPerLocked = isPerLocked(move)
        move._canEditPer = canEditAssessment(move, req.canAccess)
      })

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
