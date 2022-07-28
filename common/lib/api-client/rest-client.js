const axios = require('axios')

const {
  API: { BASE_URL },
} = require('../../../config')

const auth = require('./auth')()
const getRequestHeaders = require('./request-headers')

const restClient = async (req, url, args, options = {}) => {
  const authorizationHeader = await auth.getAuthorizationHeader()
  const requestHeaders = getRequestHeaders(req, options.format)
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

restClient.post = (req, url, data, options) =>
  restClient(req, url, data, { ...options, method: 'post' })

module.exports = restClient
