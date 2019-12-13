const { uniq } = require('lodash')

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
    const permissions = []

    if (roles.includes('ROLE_PECS_POLICE')) {
      permissions.push(
        'moves:view:by_location',
        'moves:download:by_location',
        'move:view',
        'move:create',
        'move:cancel',
        'move:delete'
      )
    }

    if (roles.includes('ROLE_PECS_PRISON')) {
      permissions.push(
        'moves:view:by_location',
        'moves:download:by_location',
        'move:view'
      )
    }

    if (roles.includes('ROLE_PECS_SUPPLIER')) {
      permissions.push(
        'moves:view:all',
        'moves:download:all',
        'moves:view:by_location',
        'moves:download:by_location'
      )
    }

    return uniq(permissions)
  },
}

module.exports = User
