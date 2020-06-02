const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

function setResultsMoves(bodyKey, locationKey) {
  return async function handleResults(req, res, next) {
    try {
      const [activeMoves, cancelledMoves] = await Promise.all([
        moveService.getActive(req.body[bodyKey]),
        moveService.getCancelled(req.body[bodyKey]),
      ])

      req.results = {
        active: activeMoves,
        cancelled: cancelledMoves,
      }
      req.resultsAsCards = {
        active: presenters.movesByLocation(activeMoves, locationKey),
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
