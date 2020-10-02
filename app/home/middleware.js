const permissions = require('../../common/middleware/permissions')

function movesRedirect(req, res, next) {
  // TODO: Remove this once we enable the dashboard for all users
  // Moves will then likely always redirect to the dashboard
  const userPermissions = req.session?.user?.permissions

  if (!permissions.check('dashboard:view', userPermissions)) {
    return res.redirect('/moves')
  }

  next()
}

module.exports = {
  movesRedirect,
}
