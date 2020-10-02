const { get } = require('lodash')

const permissions = require('../../../common/middleware/permissions')

function movesRedirect(req, res, next) {
  // TODO: Remove this once we enable the dashboard for all users
  // Moves will then likely always redirect to the dashboard
  const userPermissions = req.session?.user?.permissions

  if (!permissions.check('dashboard:view', userPermissions)) {
    return res.redirect('/moves')
  }

  next()
}

function setUserLocations(req, res, next) {
  req.userLocations = get(req.session, 'user.locations', [])
  next()
}

module.exports = {
  movesRedirect,
  setUserLocations,
}
