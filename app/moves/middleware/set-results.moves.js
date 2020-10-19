const { omitBy, isUndefined } = require('lodash')

const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

function setResultsMoves(bodyKey, locationKey) {
  return async function handleResults(req, res, next) {
    try {
      if (!req.session?.currentLocation) {
        return next()
      }

      const personEscortRecordFeature =
        req.session.featureFlags.PERSON_ESCORT_RECORD
      const args = omitBy(req.body[bodyKey], isUndefined)
      const [activeMoves, cancelledMoves] = await Promise.all([
        moveService.getActive(args),
        moveService.getCancelled(args),
      ])
      const personEscortRecordIsEnabled =
        personEscortRecordFeature && req.canAccess('person_escort_record:view')
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
