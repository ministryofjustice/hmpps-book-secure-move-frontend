const axios = require('axios')

const {
  AUTH_PROVIDERS,
  DEFAULT_AUTH_PROVIDER,
  API,
  NOMIS_ELITE2_API,
} = require('../../config')
const redisStore = require('../../config/redis-store')

const timeout = 5000

function _checkApiDependency(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { timeout })
      .then(() => resolve('OK'))
      .catch(reject)
  })
}

module.exports = [
  {
    name: 'API',
    healthcheck: () => {
      return _checkApiDependency(API.HEALTHCHECK_URL)
    },
  },
  {
    name: 'HMPPS SSO',
    healthcheck: () => {
      return _checkApiDependency(
        AUTH_PROVIDERS[DEFAULT_AUTH_PROVIDER].healthcheck_url
      )
    },
  },
  {
    name: 'HMPPS Elite2 API',
    healthcheck: () => {
      return _checkApiDependency(NOMIS_ELITE2_API.healthcheck_url)
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
