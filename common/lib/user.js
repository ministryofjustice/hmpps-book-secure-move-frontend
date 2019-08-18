function User({ name, roles = [], locations = [] } = {}) {
  this.userName = name
  this.roles = roles
  this.permissions = this.getPermissions(roles)
  this.locations = locations
}

User.prototype = {
  getPermissions(roles = []) {
    const permissions = []

    if (roles.includes('ROLE_PECS_POLICE')) {
      permissions.push(
        ...[
          'moves:view:by_location',
          'moves:download:by_location',
          'move:view',
          'move:create',
          'move:cancel',
        ]
      )
    }

    if (roles.includes('ROLE_PECS_SUPPLIER')) {
      permissions.push(...['moves:view:all', 'moves:download:all'])
    }

    return permissions
  },
}

module.exports = User
