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
  this.refreshTokenPromise = null
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
  getAccessToken() {
    if (this.isExpired()) {
      if (!this.fetchingTokenPromise) {
        this.fetchingTokenPromise = this.refreshAccessToken().then(data => {
          this.fetchingTokenPromise = null
          return data
        })
      }

      return this.fetchingTokenPromise.then(data => {
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
    debug('Refreshing token')

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

    debug('POST', url)

    // start request timer
    const authTimer = timer()
    const reqLabels = {
      url,
      method: 'POST',
    }

    return axios
      .post(this.config.authUrl, data, config)
      .then(response => {
        debug(`${response.status} ${response.statusText}`, `(POST ${url})`)
        // record successful request
        const duration = authTimer()
        clientMetrics.recordSuccess(reqLabels, response, duration)

        return response.data
      })
      .catch(error => {
        debug(
          `${error.response.status} ${error.response.statusText}`,
          `(POST ${url})`,
          error
        )
        // record error
        const duration = authTimer()
        clientMetrics.recordError(reqLabels, error, duration)

        throw error
      })
  },

  isExpired() {
    debug('Checking token')

    if (!this.accessToken || !this.tokenExpiresAt) {
      debug('Invalid token')
      return true
    }

    debug('Valid token')

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
