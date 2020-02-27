const { uniq } = require('lodash')
const { permissionsByRole } = require('./permissions')

function User({ fullname, roles = [], locations = [] } = {}) {
  this.fullname = fullname
  this.permissions = this.getPermissions(roles)
  this.locations = locations
  this.role = this.getRole(roles)
}

User.prototype = {
  getRole(roles = []) {
    let role

    if (roles.includes('ROLE_PECS_PRISON')) {
      role = 'Prison'
    }

    if (roles.includes('ROLE_PECS_POLICE')) {
      role = 'Police'
    }

    return role
  },

  getPermissions(roles = []) {
    const permissions = roles.reduce((accumulator, role) => {
      const additionalPermissions = permissionsByRole[role] || []
      return [...accumulator, ...additionalPermissions]
    }, [])
    return uniq(permissions)
  },
}

module.exports = User
