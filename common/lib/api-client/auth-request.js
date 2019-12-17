const axios = require('axios')

const auth = require('./auth')()
const { API } = require('../../../config')

async function authRequest() {
  const token = await auth.getAccessToken()

  return axios.create({
    baseURL: API.BASE_URL,
    timeout: API.TIMEOUT,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

module.exports = authRequest
