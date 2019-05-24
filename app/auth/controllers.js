const getUserInfo = function (accessToken) {
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
  get: async (req, res, next) => {
    try {
      if (typeof req.session.grant === 'undefined') {
        return res.redirect('/')
      }

      const authResponse = req.session.grant.response
      const userInfoResponse = await getUserInfo(authResponse.access_token)
      const redirectUrl = req.session.postAuthRedirect

      req.session.regenerate(function (err) {
        if (err) {
          throw err
        }

        req.session.authExpiry = authResponse.id_token.payload.exp
        req.session.userInfo = userInfoResponse.body

        res.redirect(redirectUrl)
      })
    } catch (error) {
      next(error)
    }
  },
}
