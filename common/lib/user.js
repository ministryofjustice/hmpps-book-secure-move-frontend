function User (token) {
  const permissions = []
  const authorities = token.authorities || []

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

  this.userName = token.user_name
  this.permissions = permissions
}

module.exports = User
