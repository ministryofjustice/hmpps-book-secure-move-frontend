const { pick } = require('lodash')

function _decodeAccessToken (token) {
  const payload = token.split('.')[1]
  return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
}

function processAuthResponse (req, res, next) {
  const {
    grant,
    postAuthRedirect,
  } = req.session

  if (!grant) {
    return next()
  }

  req.session.regenerate((error) => {
    if (error) {
      return next(error)
    }

    const accessToken = _decodeAccessToken(grant.response.access_token)

    req.session.authExpiry = accessToken.exp
    req.session.postAuthRedirect = postAuthRedirect
    req.session.userInfo = pick(accessToken, ['user_name', 'authorities'])

    next()
  })
}

module.exports = {
  processAuthResponse,
}
