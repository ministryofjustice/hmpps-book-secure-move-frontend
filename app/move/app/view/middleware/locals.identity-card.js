const presenters = require('../../../../../common/presenters')

function localsIdentityCard(req, res, next) {
  const { move } = req

  const identityCard = presenters.moveToCardComponent({
    isIdentityCard: true,
    // showStatus: false,
    // showTags: false,
    locationType: move.from_location.location_type,
  })(move)

  res.locals.identityCard = identityCard

  next()
}

module.exports = localsIdentityCard
