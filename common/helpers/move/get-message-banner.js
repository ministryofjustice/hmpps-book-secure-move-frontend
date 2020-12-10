const presenters = require('../../presenters')

const getMoveUrl = require('./get-move-url')

function getLocals(req) {
  const { move } = req

  const moveUrl = getMoveUrl(move.id)

  const messageBanner = presenters.moveToMessageBannerComponent({
    move,
    moveUrl,
    canAccess: req.canAccess,
  })

  return messageBanner
}

module.exports = getLocals
