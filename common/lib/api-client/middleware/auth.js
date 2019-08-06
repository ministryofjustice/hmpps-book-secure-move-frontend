const axios = require('axios')

const { API } = require('../../../../config')

let accessToken = null
let accessTokenExpiry = null

function getCurrentTime() {
  return Math.floor(new Date() / 1000)
}

function isAuthExpired() {
  const expiry = module.exports.getAccessTokenExpiry()
  const token = module.exports.getAccessToken()
  return !token || !expiry || expiry <= getCurrentTime()
}

function getAccessToken() {
  return accessToken
}

function getAccessTokenExpiry() {
  return accessTokenExpiry
}

async function refreshAccessToken() {
  const response = await axios.post(
    API.AUTH_URL,
    {},
    {
      params: {
        grant_type: 'client_credentials',
      },
      auth: {
        username: API.CLIENT_ID,
        password: API.SECRET,
      },
    }
  )

  accessToken = response.data.access_token
  accessTokenExpiry = response.data.expires_in + getCurrentTime()

  return true
}

const devourAuthMiddleware = {
  name: 'oauth-client-credentials',
  req: async function(payload) {
    if (isAuthExpired()) {
      await refreshAccessToken()
    }

    const token = module.exports.getAccessToken()
    payload.req.headers.authorization = `Bearer ${token}`

    return payload
  },
}

module.exports = {
  getAccessToken,
  getAccessTokenExpiry,
  devourAuthMiddleware,
}
