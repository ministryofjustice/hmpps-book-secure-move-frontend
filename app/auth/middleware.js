const User = require('../../common/lib/user')
const referenceData = require('../../common/services/reference-data')

function _decodeAccessToken(token) {
  const payload = token.split('.')[1]
  return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
}

function processAuthResponse(defaultLocations = []) {
  return async function middleware(req, res, next) {
    const { grant, postAuthRedirect } = req.session

    if (!grant) {
      return next()
    }

    try {
      const accessToken = _decodeAccessToken(grant.response.access_token)
      const locations = await referenceData.getLocationsById(defaultLocations)

      req.session.regenerate(error => {
        if (error) {
          return next(error)
        }

        req.session.authExpiry = accessToken.exp
        req.session.postAuthRedirect = postAuthRedirect
        req.session.user = new User({
          ...accessToken,
          locations,
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
