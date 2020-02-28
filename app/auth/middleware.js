const { get } = require('lodash')

const User = require('../../common/lib/user')
const { getFullname, getLocations } = require('../../common/services/user')
const { decodeAccessToken } = require('../../common/lib/access-token')

function processAuthResponse() {
  return async function middleware(req, res, next) {
    const { originalRequestUrl, currentLocation } = req.session
    const accessToken = get(req.session, 'grant.response.access_token')

    if (!accessToken) {
      const error = new Error('Could not authenticate user')
      error.statusCode = 403
      return next(error)
    }

    try {
      const decodedAccessToken = decodeAccessToken(accessToken)
      const [locations, fullname] = await Promise.all([
        getLocations(accessToken),
        getFullname(accessToken),
      ])

      req.session.regenerate(error => {
        if (error) {
          return next(error)
        }

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
