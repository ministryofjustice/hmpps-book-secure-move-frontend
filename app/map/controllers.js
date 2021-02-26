const axios = require('axios')
const qs = require('qs')

const {
  MAPPING: { AUTH_URL: authUrl, API_SECRET: apiSecret, API_KEY: apiKey },
} = require('../../config')

const token = function (req, res) {
  return axios
    .request({
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      url: authUrl,
      auth: {
        username: apiKey,
        password: apiSecret,
      },
      data: qs.stringify({ grant_type: 'client_credentials' }),
    })
    .then(response => {
      res.status(200)
      res.json(response.data)
    })
    .catch(() => {
      res.status(400)
      res.json({ error: 'Failed to get access token' })
    })
}

module.exports = {
  token,
}
