const querystring = require('querystring')

const axios = require('axios')
const { pickBy } = require('lodash')
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

  const payload = {
    ...pickBy(params, v => v !== undefined),
    cid: uuidv4(),
    tid: GA_ID,
  }

  return axios
    .post(
      'https://www.google-analytics.com/collect',
      querystring.stringify(payload),
      { timeout: 30000 }
    )
    .then(response => response.data)
}

/**
 * Send an 'event' hit to Google Analytics Measurement Protocol
 * @param category The event category.
 * @param action The event action.
 * @param label The event label (optional).
 * @param value The event value (optional).
 * @returns {Promise<unknown>|Promise<string>}
 */
function sendEvent({ category, action, label, value, userAgent }) {
  return sendHit({
    v: 1,
    t: 'event',
    ec: category,
    ea: action,
    el: label,
    ev: value,
    ua: userAgent,
  })
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
  sendEvent,
  sendJourneyTime,
}
