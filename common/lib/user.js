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

    if (
      roles.includes('ROLE_PECS_POLICE') ||
      roles.includes('ROLE_PECS_SCH') ||
      roles.includes('ROLE_PECS_STC')
    ) {
      permissions.push(
        'moves:view:by_location',
        'moves:download:by_location',
        'move:view',
        'move:create',
        'move:cancel'
      )
    }

    if (
      roles.includes('ROLE_PECS_PRISON') ||
      roles.includes('ROLE_PECS_HMYOI')
    ) {
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
        'moves:download:by_location',
        'move:view'
      )
    }

    return uniq(permissions)
  },
}

module.exports = User
