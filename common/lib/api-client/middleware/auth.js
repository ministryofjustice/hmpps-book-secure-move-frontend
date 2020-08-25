const auth = require('../auth')()

module.exports = {
  name: 'oauth-client-credentials',
  req: async function (payload) {
    const authorizationHeader = await auth.getAuthorizationHeader()
    payload.req.headers = {
      ...payload.req.headers,
      ...authorizationHeader,
    }

    return payload
  },
}
