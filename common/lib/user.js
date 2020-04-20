const { uniq } = require('lodash')

const { permissionsByRole } = require('./permissions')

function User({ fullname, roles = [], locations = [] } = {}) {
  this.fullname = fullname
  this.permissions = this.getPermissions(roles)
  this.locations = locations
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
