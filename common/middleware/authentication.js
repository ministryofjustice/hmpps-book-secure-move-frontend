function ensureAuthenticated (req, res, next) {
  if (!authExpired(req)) {
    return next()
  }

  req.session.postAuthRedirect = req.originalUrl
  res.redirect('/connect/okta')
}

async function processAuthResponse (req, res, next) {
  try {
    if (typeof req.session.grant === 'undefined') {
      return res.redirect('/')
    }

    const authResponse = req.session.grant.response
    const userInfoResponse = await getUserInfo(authResponse.access_token)
    const redirectUrl = req.session.postAuthRedirect

    req.session.regenerate((error) => {
      if (error) {
        throw error
      }

      req.session.authExpiry = authResponse.id_token.payload.exp
      req.session.userInfo = userInfoResponse.body
      req.session.postAuthRedirect = redirectUrl

      return next()
    })
  } catch (error) {
    next(error)
  }
}

function authExpired (req) {
  if (!authExpiry(req)) {
    return true
  }

  return authExpiry(req) < Math.floor(new Date() / 1000)
}

function authExpiry (req) {
  return req.session.authExpiry
}

function getUserInfo (accessToken) {
  const got = require('got')
  const { AUTH } = require('../../config')

  return got(
    `https://${AUTH.OKTA_SUBDOMAIN}.okta.com/oauth2/v1/userinfo`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      json: true,
    }
  )
}

module.exports = {
  ensureAuthenticated,
  processAuthResponse,
}
