function setActions(actions) {
  return function handleActions(req, res, next) {
    req.actions = actions
    next()
  }
}
module.exports = setActions
