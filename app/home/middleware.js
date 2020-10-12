function movesRedirect(req, res, next) {
  // TODO: Remove this once we enable the dashboard for all users
  // Moves will then likely always redirect to the dashboard

  if (!req.canAccess('dashboard:view')) {
    return res.redirect('/moves')
  }

  next()
}

module.exports = {
  movesRedirect,
}
