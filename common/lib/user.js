function User(token = {}) {
  this.userName = token.user_name
  this.locations = token.locations || []
  this.permissions = this.getPermissions(token.authorities)
}

User.prototype = {
  getPermissions(authorities = []) {
    const permissions = []

    if (authorities.includes('ROLE_PECS_POLICE')) {
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

    if (authorities.includes('ROLE_PECS_SUPPLIER')) {
      permissions.push(...['moves:view:all', 'moves:download:all'])
    }

    return permissions
  },
}

module.exports = User
