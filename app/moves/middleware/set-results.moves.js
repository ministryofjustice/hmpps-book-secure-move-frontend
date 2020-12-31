const { omitBy, isUndefined } = require('lodash')

const presenters = require('../../../common/presenters')

function setResultsMoves(bodyKey, locationKey) {
  return async function handleResults(req, res, next) {
    try {
      if (!req.session?.currentLocation) {
        return next()
      }

      const args = omitBy(req.body[bodyKey], isUndefined)
      const activeMoves = await req.services.move.getActive(args)

      req.resultsAsCards = presenters.movesByLocation(activeMoves, locationKey)

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = setResultsMoves
