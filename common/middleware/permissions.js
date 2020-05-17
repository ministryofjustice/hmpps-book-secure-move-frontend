const { get } = require('lodash')

function check(permissions, userPermissions = []) {
  if (!Array.isArray(permissions)) {
    permissions = [permissions]
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
