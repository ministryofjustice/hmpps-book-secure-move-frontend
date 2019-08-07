const queryString = require('query-string')
const { get } = require('lodash')
const { startOfTomorrow } = require('date-fns')

const movesApp = require('../../app/moves')
const { check } = require('./permissions')

module.exports = function setLocals(req, res, next) {
  const protocol = req.encrypted ? 'https' : req.protocol
  const baseUrl = `${protocol}://${req.get('host')}`
  const movesSearch = queryString.stringify(req.session.movesQuery)
  const locals = {
    CANONICAL_URL: baseUrl + req.path,
    TODAY: new Date(),
    TOMORROW: startOfTomorrow(),
    REQUEST_PATH: req.path,
    CURRENT_LOCATION: req.session.currentLocation,
    MOVES_URL: movesSearch
      ? `${movesApp.mountpath}?${movesSearch}`
      : movesApp.mountpath,
    getLocal: key => res.locals[key],
    getMessages: () => req.flash(),
    canAccess: permission => {
      const userPermissions = get(req.session, 'user.permissions')
      return check(permission, userPermissions)
    },
  }

  res.locals = {
    ...res.locals,
    ...locals,
  }

  next()
}
