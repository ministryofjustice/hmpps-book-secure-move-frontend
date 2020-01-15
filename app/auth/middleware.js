const User = require('../../common/lib/user')
const {
  getFullname,
  getLocations,
  getSupplierId,
} = require('../../common/services/user')
const { decodeAccessToken } = require('../../common/lib/access-token')

function processAuthResponse() {
  return async function middleware(req, res, next) {
    const { grant, postAuthRedirect } = req.session

    if (!grant) {
      return next()
    }

    try {
      const accessToken = grant.response.access_token
      const decodedAccessToken = decodeAccessToken(grant.response.access_token)
      const [locations, fullname, supplierId] = await Promise.all([
        getLocations(accessToken),
        getFullname(accessToken),
        getSupplierId(accessToken),
      ])

      req.session.regenerate(error => {
        if (error) {
          return next(error)
        }

        req.session.authExpiry = decodedAccessToken.exp
        req.session.postAuthRedirect = postAuthRedirect
        req.session.user = new User({
          fullname,
          locations,
          roles: decodedAccessToken.authorities,
          supplierId,
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
