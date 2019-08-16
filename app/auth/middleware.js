const User = require('../../common/lib/user')
const userLocationService = require('../../common/services/user-locations')
const { decodeAccessToken } = require('../../common/lib/access-token')

function processAuthResponse() {
  return async function middleware(req, res, next) {
    const { grant, postAuthRedirect } = req.session

    if (!grant) {
      return next()
    }

    try {
      const userLocations = await userLocationService.getUserLocations(
        grant.response.access_token
      )

      req.session.regenerate(error => {
        if (error) {
          return next(error)
        }

        const accessToken = decodeAccessToken(grant.response.access_token)

        req.session.authExpiry = accessToken.exp
        req.session.postAuthRedirect = postAuthRedirect
        req.session.user = new User({
          name: accessToken.user_name,
          roles: accessToken.authorities,
          locations: userLocations,
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
