const uuidv4 = require('uuid/v4')
const axios = require('axios')
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
      timeout: 30000,
      params: {
        ...params,
        cid: uuidv4(),
        tid: GA_ID,
      },
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
    v: 1,
    t: 'timing',
    utl: 'Journey duration',
    ...params,
  })
}

module.exports = {
  sendJourneyTime,
}
