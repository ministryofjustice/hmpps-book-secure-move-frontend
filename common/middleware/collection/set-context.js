function setContext(context) {
  return function handleContext(req, res, next) {
    req.context = context
    next()
  }
}

module.exports = setContext
