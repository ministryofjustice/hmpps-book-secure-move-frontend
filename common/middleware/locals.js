const { startOfTomorrow } = require('date-fns')
const { get } = require('lodash')

const movesApp = require('../../app/moves')

const { check } = require('./permissions')

module.exports = function setLocals(req, res, next) {
  const protocol = req.encrypted ? 'https' : req.protocol
  const baseUrl = `${protocol}://${req.get('host')}`
  const locals = {
    CANONICAL_URL: baseUrl + req.path,
    TODAY: new Date(),
    TOMORROW: startOfTomorrow(),
    REQUEST_PATH: req.path,
    USER: req.session.user,
    CURRENT_LOCATION: req.session.currentLocation,
    MOVES_URL: req.session.movesUrl || movesApp.mountpath,
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
