const axios = require('axios')
const debug = require('debug')('app:api-client:auth')

const { API } = require('../../../config')
const timer = require('../timer')

const clientMetrics = require('./client-metrics')
let authInstance = null

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

  async getAuthorizationHeader() {
    const token = await this.getAccessToken()
    return { Authorization: `Bearer ${token}` }
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

    const url = this.config.authUrl

    debug('AUTH REQUEST', url)

    // start request timer
    const authTimer = timer()
    const reqLabels = {
      url,
      method: 'POST',
    }

    return axios
      .post(this.config.authUrl, data, config)
      .then(response => {
        debug('AUTH SUCCESS', url)
        // record successful request
        const duration = authTimer()
        clientMetrics.recordSuccess(reqLabels, response, duration)

        return response.data
      })
      .catch(error => {
        debug('AUTH ERROR', url, error)
        // record error
        const duration = authTimer()
        clientMetrics.recordError(reqLabels, error, duration)

        throw error
      })
  },

  isExpired() {
    if (!this.accessToken || !this.tokenExpiresAt) {
      return true
    }

    return this.tokenExpiresAt <= getTimestamp()
  },
}

function getAuthInstance(
  options = {
    timeout: API.AUTH_TIMEOUT,
    authUrl: API.AUTH_URL,
    username: API.CLIENT_ID,
    password: API.SECRET,
  }
) {
  if (!authInstance) {
    authInstance = new Auth(options)
  }

  return authInstance
}

module.exports = getAuthInstance
