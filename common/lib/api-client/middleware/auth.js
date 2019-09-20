const { API } = require('../../../../config')
const Auth = require('../auth')

const auth = new Auth({
  timeout: API.TIMEOUT,
  authUrl: API.AUTH_URL,
  username: API.CLIENT_ID,
  password: API.SECRET,
})

module.exports = {
  name: 'oauth-client-credentials',
  req: async function(payload) {
    const token = await auth.getAccessToken()

    payload.req.headers.authorization = `Bearer ${token}`

    return payload
  },
}
