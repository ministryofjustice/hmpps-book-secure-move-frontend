const presenters = require('../../presenters')

const getMoveUrl = require('./get-move-url')

function getMessageBanner(move, canAccess) {
  const moveUrl = getMoveUrl(move.id)

  const messageBanner = presenters.moveToMessageBannerComponent({
    move,
    moveUrl,
    canAccess,
  })

  return messageBanner
}

module.exports = getMessageBanner
