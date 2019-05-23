const getUserInfo = function (accessToken) {
  const got = require('got')
  const { OKTA_SUBDOMAIN } = require('../../config')

  return got(
    `https://${OKTA_SUBDOMAIN}.okta.com/oauth2/v1/userinfo`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      json: true,
    }
  )
}

module.exports = {
  get: async (req, res, next) => {
    try {
      const { session } = req

      if (typeof session.grant === 'undefined') return res.redirect('/')

      const authResponse = session.grant.response
      const response = await getUserInfo(authResponse.access_token)

      session.authExpiry = authResponse.id_token.payload.exp
      session.userInfo = response.body

      res.redirect(session.postAuthRedirect)
    } catch (error) {
      next(error)
    }
  },
}
