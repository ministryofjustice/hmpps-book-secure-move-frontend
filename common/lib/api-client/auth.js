const axios = require('axios')

const { API } = require('../../../config')
let authInstance = null

function getTimestamp() {
  return Math.floor(new Date() / 1000)
}

function Auth({ timeout = 10000, authUrl, username, password } = {}) {
  this.accessToken = null
  this.tokenExpiresAt = null
  this.config = {
    authUrl,
    password,
    timeout,
    username,
  }
}

Auth.prototype = {
  async getAccessToken() {
    if (this.isExpired()) {
      return this.refreshAccessToken().then(data => {
        this.accessToken = data.access_token
        this.tokenExpiresAt = data.expires_in + getTimestamp()

        return this.accessToken
      })
    }

    return Promise.resolve(this.accessToken)
  },

  isExpired() {
    if (!this.accessToken || !this.tokenExpiresAt) {
      return true
    }

    return this.tokenExpiresAt <= getTimestamp()
  },

  refreshAccessToken() {
    const data = {
      grant_type: 'client_credentials',
    }
    const config = {
      auth: {
        password: this.config.password,
        username: this.config.username,
      },
      timeout: this.config.timeout,
    }

    return axios
      .post(this.config.authUrl, data, config)
      .then(response => response.data)
  },
}

function getAuthInstance(
  options = {
    authUrl: API.AUTH_URL,
    password: API.SECRET,
    timeout: API.TIMEOUT,
    username: API.CLIENT_ID,
  }
) {
  if (!authInstance) {
    authInstance = new Auth(options)
  }

  return authInstance
}

module.exports = getAuthInstance
