const { get } = require('lodash')

const { prohibitionsByLocationType } = require('../lib/prohibitions')

function check(permissions, userPermissions = [], locationType) {
  if (!Array.isArray(permissions)) {
    permissions = [permissions]
  }

  const locationTypeProhibitions = prohibitionsByLocationType[locationType]

  if (
    locationTypeProhibitions &&
    permissions.some(permission =>
      locationTypeProhibitions.includes(permission)
    )
  ) {
    return false
  }

  return permissions.some(permission => userPermissions.includes(permission))
}

function protectRoute(permission) {
  return (req, res, next) => {
    const userPermissions = get(req.session, 'user.permissions')

    if (check(permission, userPermissions)) {
      return next()
    }

    const error = new Error(`Forbidden. Missing permission: '${permission}'`)
    error.statusCode = 403

    next(error)
  }
}

module.exports = {
  check,
  protectRoute,
}
