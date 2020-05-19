const { isEmpty } = require('lodash')
const querystring = require('qs')

function redirectDefaultQuery(defaults = {}) {
  return function handleQueryRedirect(req, res, next, view) {
    const query = defaults[view]

    if (!isEmpty(query) && isEmpty(req.query)) {
      return res.redirect(`${req.originalUrl}?${querystring.stringify(query)}`)
    }

    next()
  }
}

module.exports = redirectDefaultQuery
