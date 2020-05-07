const { uniq } = require('lodash')

const { permissionsByRole } = require('./permissions')

function User({ fullname, roles = [], locations = [], username, userId } = {}) {
  this.fullname = fullname
  this.permissions = this.getPermissions(roles)
  this.locations = locations
  this.username = username
  this.userId = userId
}

User.prototype = {
  getPermissions(roles = []) {
    const permissions = roles.reduce((accumulator, role) => {
      const additionalPermissions = permissionsByRole[role] || []
      return [...accumulator, ...additionalPermissions]
    }, [])
    return uniq(permissions)
  },
}

module.exports = User
