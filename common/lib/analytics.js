const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

const { ANALYTICS: { GA_ID } = {} } = require('../../config')

/**
 *
 * Server side implementation of sending hit data to Google Analytics
 * Measurement Protocol
 * https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
 *
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
function sendHit(params) {
  if (!GA_ID) {
    return Promise.resolve()
  }

  return axios
    .post('https://www.google-analytics.com/collect', null, {
      params: {
        ...params,
        cid: uuidv4(),
        tid: GA_ID,
      },
      timeout: 30000,
    })
    .then(response => response.data)
}

/**
 * Send a 'timing' hit to Google Analytics Measurement Protocol
 * @param params
 * @returns {Promise<unknown>|Promise<string>}
 */
function sendJourneyTime(params = {}) {
  return sendHit({
    t: 'timing',
    utl: 'Journey duration',
    v: 1,
    ...params,
  })
}

module.exports = {
  sendJourneyTime,
}
