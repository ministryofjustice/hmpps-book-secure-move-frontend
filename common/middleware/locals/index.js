const { startOfTomorrow } = require('date-fns')

const getAssetPath = require('./get-asset-path')

module.exports = function setLocals (req, res, next) {
  const locals = {
    getAssetPath,
    TODAY: new Date(),
    TOMORROW: startOfTomorrow(),
    getLocal: key => res.locals[key],
    getMessages: () => req.flash(),
    translate: key => req.translate(key),
  }

  res.locals = Object.assign({}, res.locals, locals)

  next()
}
