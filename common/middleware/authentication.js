const { pick } = require('lodash')

function ensureAuthenticated (req, res, next) {
  if (!isAuthExpired(req)) {
    return next()
  }

  req.session.postAuthRedirect = req.originalUrl
  res.redirect('/connect/hmpps')
}

function decodeAccessToken (token) {
  const payload = token.split('.')[1]
  return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
}

async function processAuthResponse (req, res, next) {
  try {
    if (typeof req.session.grant === 'undefined') {
      return res.redirect('/')
    }

    const authResponse = req.session.grant.response
    const redirectUrl = req.session.postAuthRedirect

    req.session.regenerate((error) => {
      if (error) {
        throw error
      }

      const accessToken = decodeAccessToken(authResponse.access_token)

      req.session.authExpiry = accessToken.exp
      req.session.userInfo = pick(accessToken, ['user_name', 'authorities'])
      req.session.postAuthRedirect = redirectUrl

      return next()
    })
  } catch (error) {
    next(error)
  }
}

function isAuthExpired (req) {
  if (!req.session.authExpiry) {
    return true
  }

  return req.session.authExpiry < Math.floor(new Date() / 1000)
}

module.exports = {
  ensureAuthenticated,
  processAuthResponse,
}
