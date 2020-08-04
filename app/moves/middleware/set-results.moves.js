const permissions = require('../../../common/middleware/permissions')
const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

function setResultsMoves(bodyKey, locationKey, personEscortRecordFeature) {
  return async function handleResults(req, res, next) {
    try {
      const [activeMoves, cancelledMoves] = await Promise.all([
        moveService.getActive(req.body[bodyKey]),
        moveService.getCancelled(req.body[bodyKey]),
      ])
      const userPermissions = req.session?.user?.permissions
      const personEscortRecordIsEnabled =
        personEscortRecordFeature &&
        permissions.check('person_escort_record:view', userPermissions)
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
