const axios = require('axios')

const auth = require('./auth')()
const { API } = require('../../../config')

async function authRequest(headers) {
  const token = await auth.getAccessToken()

  return axios.create({
    baseURL: API.BASE_URL,
    timeout: API.TIMEOUT,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
  })
}

module.exports = authRequest
