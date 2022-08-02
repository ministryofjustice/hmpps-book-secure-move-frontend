const {
  getFullName,
  getSupplierId,
  getLocations,
} = require('../../common/services/user')

const { decodeAccessToken } = require('./access-token')
const { rolesToPermissions } = require('./permissions')

const forenameToInitial = name => {
  if (!name) {
    return null
  }

  return `${name.charAt()}. ${name.split(' ').pop()}`
}

async function loadUser(req, accessToken) {
  const {
    user_id: userId,
    user_name: username,
    authorities,
  } = decodeAccessToken(accessToken)

  const [fullname, supplierId] = await Promise.all([
    getFullName(accessToken),
    getSupplierId(accessToken),
  ])

  const displayName = forenameToInitial(fullname)

  const permissions = rolesToPermissions(authorities)

  const locations = await getLocations(
    req,
    accessToken,
    supplierId,
    permissions
  )
  locations.sort((a, b) => a.title.localeCompare(b.title))

  return {
    userId,
    username,
    fullname,
    supplierId,
    displayName,
    permissions,
    locations,
  }
}

module.exports = { loadUser }
