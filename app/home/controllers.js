const { get } = require('lodash')

const permissions = require('../../common/middleware/permissions')

function home (req, res, next) {
  const userPermissions = get(req.session, 'user.permissions')
  const currentLocation = get(req.session, 'currentLocation.id')

  if (permissions.check('moves:view:all', userPermissions)) {
    return res.redirect('/moves')
  }

  if (
    permissions.check('moves:view:by_location', userPermissions) &&
    currentLocation
  ) {
    return res.redirect(`/moves/${currentLocation}`)
  }

  next()
}

module.exports = {
  home,
}
