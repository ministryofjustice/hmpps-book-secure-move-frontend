const uuidv4 = require('uuid/v4')
const axios = require('axios')
const { get } = require('lodash')
const {
  ANALYTICS: { GA_ID },
  API: { TIMEOUT: timeout },
} = require('../../config')

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
  return axios.post('https://www.google-analytics.com/collect', null, {
    params: {
      ...params,
      cid: uuidv4(),
      tid: GA_ID,
    },
    timeout,
  })
}

/**
 * Send a 'timing' hit to Google Analytics Measurement Protocol
 * @param req
 * @param timestampKey
 * @param params
 * @returns {Promise<unknown>|Promise<string>}
 */
function sendJourneyTime(req, timestampKey, params = {}) {
  if (!GA_ID) {
    return Promise.resolve('No GA ID!')
  }

  const timestamp = get(req, `session.${timestampKey}`)
  const user = get(req, 'session.user')
  const journeyDuration = Math.round(new Date().getTime() - timestamp)

  return sendHit({
    v: 1,
    t: 'timing',
    utl: 'Journey duration',
    utt: journeyDuration,
    utc: user.role,
    ...params,
  }).then(() => {
    delete req.session[timestampKey]

    return req.session.save(
      error =>
        new Promise((resolve, reject) => {
          if (error) {
            reject(error)
          }
          resolve('GA hit sent')
        })
    )
  })
}

module.exports = {
  sendJourneyTime,
}
