const User = require('../../common/lib/user')
const { getFullname, getLocations } = require('../../common/services/user')
const { decodeAccessToken } = require('../../common/lib/access-token')

function processAuthResponse() {
  return async function middleware(req, res, next) {
    const { grant, originalRequestUrl, currentLocation } = req.session

    if (!grant) {
      return next()
    }

    try {
      const accessToken = grant.response.access_token
      const decodedAccessToken = decodeAccessToken(grant.response.access_token)
      const [locations, fullname] = await Promise.all([
        getLocations(accessToken),
        getFullname(accessToken),
      ])

      req.session.regenerate(error => {
        if (error) {
          return next(error)
        }

        decodedAccessToken.authorities.push('ROLE_PECS_OCA')

        req.session.authExpiry = decodedAccessToken.exp
        req.session.currentLocation = currentLocation
        req.session.originalRequestUrl = originalRequestUrl
        req.session.user = new User({
          fullname,
          locations,
          roles: decodedAccessToken.authorities,
        })

        next()
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  processAuthResponse,
}
