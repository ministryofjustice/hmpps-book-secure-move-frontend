const { startOfTomorrow } = require('date-fns')

module.exports = function setLocals (req, res, next) {
  const locals = {
    TODAY: new Date(),
    TOMORROW: startOfTomorrow(),
    CURRENT_LOCATION: req.session.currentLocation,
    getLocal: key => res.locals[key],
    getMessages: () => req.flash(),
  }

  res.locals = {
    ...res.locals,
    ...locals,
  }

  next()
}
