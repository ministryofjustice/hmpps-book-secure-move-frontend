const axios = require('axios')

const {
  API: { BASE_URL },
} = require('../../../config')

const auth = require('./auth')()
const getRequestHeaders = require('./request-headers')

const restClient = async (url, args, options = {}) => {
  const authorizationHeader = await auth.getAuthorizationHeader()
  const requestHeaders = getRequestHeaders(options.format)
  const headers = {
    ...authorizationHeader,
    ...requestHeaders,
  }

  const argsType = options.method === 'post' ? 'data' : 'params'

  if (args && options[argsType] === undefined) {
    options[argsType] = args
  }

  const response = await axios(`${BASE_URL}${url}`, {
    ...options,
    headers,
  })
  return response.data
}

restClient.get = restClient

restClient.post = (url, data, options) =>
  restClient(url, data, { ...options, method: 'post' })

module.exports = restClient
