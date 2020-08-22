const axios = require('axios')

const {
  API: { BASE_URL },
} = require('../../../config')

const auth = require('./auth')()
const getRequestHeaders = require('./request-headers')

const restClient = async (url, params, options = {}) => {
  const authorizationHeader = await auth.getAuthorizationHeader()
  const requestHeaders = getRequestHeaders(options.format)
  const headers = {
    ...authorizationHeader,
    ...requestHeaders,
  }

  const response = await axios(`${BASE_URL}${url}`, {
    ...options,
    params,
    headers,
  })
  return response.data
}

module.exports = restClient
