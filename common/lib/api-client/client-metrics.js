const metrics = require('../metrics')

// values for metrics
const labelNames = ['path', 'method', 'status', 'status_text', 'error']
const buckets = [0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 30, 60]

let apiClientRequestHistogram
let apiClientRequestSuccessCounter
let apiClientRequestErrorCounter

const start = req => {
  if (!apiClientRequestHistogram) {
    const promClient = metrics.getClient()
    apiClientRequestHistogram = new promClient.Histogram({
      name: 'api_client_requests_histogram',
      help: 'API calls using devour client',
      labelNames,
      buckets,
    })
    apiClientRequestSuccessCounter = new promClient.Counter({
      name: 'api_client_requests_success_counter',
      help: 'Total successful API calls',
    })
    apiClientRequestErrorCounter = new promClient.Counter({
      name: 'api_client_requests_error_counter',
      help: 'Total API call errors',
    })
  }

  const { method, url } = req

  const labels = {
    method,
    path: metrics.normalizeUrlToPath(url),
  }

  const histogramTimer = apiClientRequestHistogram.startTimer(labels)
  return {
    histogramTimer,
    successCounter: apiClientRequestSuccessCounter,
    errorCounter: apiClientRequestErrorCounter,
  }
}

const endTimer = (instrumentation, response = {}, additionalLabels) => {
  const { status = '[undefined]', statusText = '[undefined]' } = response
  const { histogramTimer } = instrumentation
  histogramTimer({
    status,
    status_text: statusText,
    ...additionalLabels,
  })
}

const stop = (instrumentation, reponse) => {
  endTimer(instrumentation, reponse)
  instrumentation.successCounter.inc()
}

const stopWithError = (instrumentation, error) => {
  endTimer(instrumentation, error.response, {
    error: true,
  })
  instrumentation.errorCounter.inc()
}

module.exports = {
  start,
  stop,
  stopWithError,
}
