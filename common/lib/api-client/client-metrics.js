const metrics = require('../metrics')

// values for metrics
const counterLabelNames = ['path', 'method']
const histogramLabelNames = ['path', 'method', 'status', 'status_text', 'error']
const buckets = [0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 30, 60]

let apiClientRequestHistogram
let apiClientRequestSuccessCounter
let apiClientRequestErrorCounter

const initialiseInstrumentation = () => {
  if (!apiClientRequestHistogram) {
    const promClient = metrics.getClient()
    apiClientRequestHistogram = new promClient.Histogram({
      name: 'api_client_requests_histogram',
      help: 'API calls using devour client',
      labelNames: histogramLabelNames,
      buckets,
    })
    apiClientRequestSuccessCounter = new promClient.Counter({
      name: 'api_client_requests_success_counter',
      labelNames: counterLabelNames,
      help: 'Total successful API calls',
    })
    apiClientRequestErrorCounter = new promClient.Counter({
      name: 'api_client_requests_error_counter',
      labelNames: counterLabelNames,
      help: 'Total API call errors',
    })
  }
}

const getReqLabels = req => {
  const { method, url } = req
  const path = metrics.normalizeUrlToPath(url)
  return {
    method,
    path,
  }
}

const record = (req, response = {}, duration = 0, additionalLabels) => {
  initialiseInstrumentation()

  const reqLabels = getReqLabels(req)

  const { status = '[undefined]', statusText = '[undefined]' } = response

  const labels = {
    ...reqLabels,
    status,
    status_text: statusText,
    ...additionalLabels,
  }

  apiClientRequestHistogram.observe(labels, duration)
}

/**
 * Record metrics a successful client request
 *
 * @param {object} req
 * Client request object or an object with at least a method and url property
 *
 * @param {object} response
 * Request’s response object
 *
 * @param {number} duration
 * Time elapsed for request
 *
 * @returns {undefined}
 */
const recordSuccess = (req, response, duration) => {
  record(req, response, duration)
  const reqLabels = getReqLabels(req)
  apiClientRequestSuccessCounter.inc(reqLabels)
}

/**
 * Record metrics a failed client request
 *
 * @param {object} req
 * Client request object or an object with at least a method and url property
 *
 * @param {object} error
 * Request’s error object
 *
 * @param {number} duration
 * Time elapsed for request
 *
 * @returns {undefined}
 */
const recordError = (req, error, duration) => {
  record(req, error.response, duration, { error: true })
  const reqLabels = getReqLabels(req)
  apiClientRequestErrorCounter.inc(reqLabels)
}

module.exports = {
  recordSuccess,
  recordError,
}
