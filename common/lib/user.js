const { rolesToPermissions } = require('./permissions')

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
  this.permissions = rolesToPermissions(roles)
  this.locations = locations
  this.username = username
  this.id = userId
  this.supplierId = supplierId
}

module.exports = User
