const { get } = require('lodash')

const { decodeAccessToken } = require('../../common/lib/access-token')
const User = require('../../common/lib/user')
const {
  getFullname,
  getSupplierId,
  getLocations,
} = require('../../common/services/user')

function processAuthResponse() {
  return async function middleware(req, res, next) {
    const accessToken = get(req.session, 'grant.response.access_token')

    if (!accessToken) {
      const error = new Error('Could not authenticate user')
      error.statusCode = 403
      return next(error)
    }

    try {
      const decodedAccessToken = decodeAccessToken(accessToken)
      const { user_name: username, user_id: userId } = decodedAccessToken
      const [fullname, supplierId] = await Promise.all([
        getFullname(accessToken),
        getSupplierId(accessToken),
      ])

      const previousSession = { ...req.session }

      const user = new User({
        fullname,
        roles: decodedAccessToken.authorities,
        username,
        userId,
        supplierId,
      })

      user.locations = await getLocations(
        accessToken,
        this.supplierId,
        this.permissions
      )

      req.session.regenerate(error => {
        if (error) {
          return next(error)
        }

        req.session.authExpiry = decodedAccessToken.exp
        req.session.user = user

        // copy any previous session properties ignoring grant or any that already exist
        Object.keys(previousSession).forEach(key => {
          if (req.session[key]) {
            return
          }

          if (key === 'grant') {
            return
          }

          req.session[key] = previousSession[key]
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
