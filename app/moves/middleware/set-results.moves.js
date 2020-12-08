const { omitBy, isUndefined } = require('lodash')

const presenters = require('../../../common/presenters')

function setResultsMoves(bodyKey, locationKey) {
  return async function handleResults(req, res, next) {
    try {
      if (!req.session?.currentLocation) {
        return next()
      }

      const args = omitBy(req.body[bodyKey], isUndefined)
      const [activeMoves, cancelledMoves] = await Promise.all([
        req.services.move.getActive(args),
        req.services.move.getCancelled(args),
      ])
      const personEscortRecordIsEnabled = req.canAccess(
        'person_escort_record:view'
      )
      const cardTagSource = personEscortRecordIsEnabled
        ? 'personEscortRecord'
        : undefined

      req.resultsAsCards = {
        active: presenters.movesByLocation(
          activeMoves,
          locationKey,
          cardTagSource
        ),
        cancelled: cancelledMoves.map(
          presenters.moveToCardComponent({
            showMeta: false,
            showTags: false,
            showImage: false,
          })
        ),
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setResultsMoves
