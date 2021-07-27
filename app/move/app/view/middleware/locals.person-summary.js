const presenters = require('../../../../../common/presenters')

function localsMoveDetails(req, res, next) {
  const profile = req.move?.profile

  if (!profile) {
    return next()
  }

  const personSummary = presenters.personToMetaListComponent(profile.person)

  res.locals.personSummary = personSummary
  res.locals.person = profile.person

  next()
}

module.exports = localsMoveDetails
