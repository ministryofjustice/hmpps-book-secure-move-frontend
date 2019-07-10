const axios = require('axios')

const { AUTH_PROVIDERS, DEFAULT_AUTH_PROVIDER, API } = require('../../config')
const redisStore = require('../../config/redis-store')

const timeout = 5000

module.exports = [
  {
    name: 'API',
    healthcheck: () => {
      return new Promise((resolve, reject) => {
        axios
          .get(API.HEALTHCHECK_URL, { timeout })
          .then(() => resolve('OK'))
          .catch(reject)
      })
    },
  },
  {
    name: 'HMPPS SSO',
    healthcheck: () => {
      return new Promise((resolve, reject) => {
        axios
          .get(AUTH_PROVIDERS[DEFAULT_AUTH_PROVIDER].healthcheck_url, {
            timeout,
          })
          .then(() => resolve('OK'))
          .catch(reject)
      })
    },
  },
  {
    name: 'redis',
    healthcheck: () => {
      return new Promise((resolve, reject) => {
        const result = redisStore().client.ping()

        if (!result) {
          reject(new Error('No connection'))
        }

        resolve('OK')
      })
    },
  },
]
