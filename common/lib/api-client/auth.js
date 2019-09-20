const axios = require('axios')

function getTimestamp() {
  return Math.floor(new Date() / 1000)
}

function Auth({ timeout = 10000, authUrl, username, password } = {}) {
  this.accessToken = null
  this.tokenExpiresAt = null
  this.config = {
    timeout,
    authUrl,
    username,
    password,
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

  refreshAccessToken() {
    const data = {
      grant_type: 'client_credentials',
    }
    const config = {
      timeout: this.config.timeout,
      auth: {
        username: this.config.username,
        password: this.config.password,
      },
    }

    return axios
      .post(this.config.authUrl, data, config)
      .then(response => response.data)
  },

  isExpired() {
    if (!this.accessToken || !this.tokenExpiresAt) {
      return true
    }

    return this.tokenExpiresAt <= getTimestamp()
  },
}

module.exports = Auth
