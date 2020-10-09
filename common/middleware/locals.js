const { startOfTomorrow } = require('date-fns')

const movesApp = require('../../app/moves')

module.exports = function setLocals(req, res, next) {
  const protocol = req.encrypted ? 'https' : req.protocol
  const baseUrl = `${protocol}://${req.get('host')}`
  const locals = {
    CANONICAL_URL: baseUrl + req.path,
    TODAY: new Date(),
    TOMORROW: startOfTomorrow(),
    REQUEST_PATH: req.path,
    USER: req.user,
    CURRENT_LOCATION: req.session.currentLocation,
    CURRENT_REGION: req.session.currentRegion,
    MOVES_URL: req.session.movesUrl || movesApp.mountpath,
    getLocal: key => res.locals[key],
    getMessages: () => req.flash(),
    canAccess: permission => {
      if (!req.checkPermissions) {
        return false
      }

      return req.checkPermissions(permission)
    },
  }

  res.locals = {
    ...res.locals,
    ...locals,
  }

  next()
}
