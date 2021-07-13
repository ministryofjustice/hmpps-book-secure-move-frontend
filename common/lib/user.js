const { rolesToPermissions } = require('./permissions')

const forenameToInitial = name => {
  if (!name) {
    return null
  }

  return `${name.charAt()}. ${name.split(' ').pop()}`
}

function User({ fullname, roles = [], username, userId, supplierId } = {}) {
  this.fullname = fullname
  this.displayName = forenameToInitial(fullname)
  this.permissions = rolesToPermissions(roles)
  this.username = username
  this.id = userId
  this.supplierId = supplierId

  this.locations = []
}

module.exports = User
