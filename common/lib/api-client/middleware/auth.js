const auth = require('../auth')()

module.exports = {
  name: 'oauth-client-credentials',
  req: async function(payload) {
    const token = await auth.getAccessToken()

    payload.req.headers.authorization = `Bearer ${token}`

    return payload
  },
}
