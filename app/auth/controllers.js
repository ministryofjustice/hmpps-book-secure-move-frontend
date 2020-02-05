const { AUTH_PROVIDERS, DEFAULT_AUTH_PROVIDER } = require('../../config')

module.exports = {
  redirect: (req, res) => {
    const url = req.session.originalRequestUrl || '/'

    req.session.originalRequestUrl = null

    res.redirect(url)
  },
  signOut: (req, res) => {
    const authProviderLogoutUrl =
      AUTH_PROVIDERS[DEFAULT_AUTH_PROVIDER].logout_url

    req.session.destroy(() => {
      res.redirect(authProviderLogoutUrl)
    })
  },
}
