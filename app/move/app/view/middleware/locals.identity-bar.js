const presenters = require('../../../../../common/presenters')
const filters = require('../../../../../config/nunjucks/filters')

function localsIdentityCard(req, res, next) {
  const { canAccess, move } = req

  if (!move) {
    return next()
  }

  const identityBar = {
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
    summary: {
      html: req.t('moves::detail.page_heading_summary', {
        fromLocation: move.from_location?.title,
        toLocation: move.to_location?.title,
        date: filters.formatDate(move.date),
      }),
    },
  }

  res.locals.identityBar = identityBar

  next()
}

module.exports = localsIdentityCard
