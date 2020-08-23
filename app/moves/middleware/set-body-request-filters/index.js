const ageFilter = require('./age')

function setBodyRequestFilters(req, res, next) {
  const { age } = req.query

  req.body.requested = {
    ...req.body.requested,
    ...ageFilter(age),
  }

  next()
}

module.exports = setBodyRequestFilters
