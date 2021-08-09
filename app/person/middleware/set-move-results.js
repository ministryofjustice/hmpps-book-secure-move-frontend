const presenters = require('../../../common/presenters')

module.exports = async (req, res, next) => {
  const filter = {
    person_id: req.person.id,
  }

  const include = ['from_location', 'to_location']

  try {
    req.results = {
      data: await req.services.move.getAll({ filter, include }),
    }

    req.resultsAsTable = presenters.movesToTableComponent({ query: req.query })(
      req.results.data
    )
  } catch (e) {
    return next(e)
  }

  next()
}
