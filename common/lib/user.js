const { uniq } = require('lodash')

const { permissionsByRole } = require('./permissions')

const forenameToInitial = name => {
  if (!name) {
    return null
  }

  return `${name.charAt()}. ${name.split(' ').pop()}`
}

function User({
  fullname,
  roles = [],
  locations = [],
  username,
  userId,
  supplierId,
} = {}) {
  this.fullname = fullname
  this.displayName = forenameToInitial(fullname)
  this.permissions = this.getPermissions(roles)
  this.locations = locations
  this.username = username
  this.id = userId
  this.supplierId = supplierId
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
