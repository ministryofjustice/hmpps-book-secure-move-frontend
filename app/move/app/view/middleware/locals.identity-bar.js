const presenters = require('../../../../../common/presenters')

function localsIdentityCard(req, res, next) {
  const { canAccess, move, journeys } = req

  if (!move) {
    return next()
  }

  res.locals.identityBar = {
    actions: presenters.moveToIdentityBarActions(move, { canAccess }),
    classes: 'sticky',
    caption: {
      text: req.t('moves::detail.page_caption'),
    },
    heading: {
      html: req.t('moves::detail.page_heading', {
        name: move.profile?.person?._fullname || req.t('awaiting_person'),
        reference: move.reference,
      }),
    },
    journeys: presenters.moveToJourneysSummary(move, journeys),
  }

  next()
}

module.exports = localsIdentityCard
