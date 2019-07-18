const { get } = require('lodash')
const { startOfTomorrow } = require('date-fns')

const { check } = require('./permissions')

module.exports = function setLocals (req, res, next) {
  const locals = {
    TODAY: new Date(),
    TOMORROW: startOfTomorrow(),
    ORIGINAL_PATH: req.originalUrl.split('?').shift(),
    CURRENT_LOCATION: req.session.currentLocation,
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
