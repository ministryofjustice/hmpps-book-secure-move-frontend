const promster = require('@promster/express')

let prometheusClient

// Create noop version of Prometheus client
//
// Enables code with instrumentation to run
// even if metrics have not been initialized
// and avoid need for wrapping in conditionals
const emptyFn = () => {}

const inc = emptyFn
const dec = emptyFn
const set = emptyFn
const observe = emptyFn
const setToCurrentTime = emptyFn
const endTimer = emptyFn
const startTimer = () => endTimer

const observeValues = () => {
  return {
    observe,
    startTimer,
  }
}

prometheusClient = {
  Counter: function () {
    return {
      inc,
    }
  },
  Gauge: function () {
    return {
      inc,
      dec,
      set,
      setToCurrentTime,
      startTimer,
    }
  },
  Histogram: function () {
    return observeValues()
  },
  Summary: function () {
    return observeValues()
  },
}

const uuidRegex =
  /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/gi
const dateRegex = /\d{4}-\d{2}-\d{2}/g
const authCallbackRegex = /(callback\?code)=.*/
const lookupValueRegex =
  /(filter\[(prison_number|police_national_computer)\])=[^&]+/g
const assetRegex = /\.[0-9a-f]{8}\.(js|css|woff.*|svg|png|jpg|gif)$/

/**
 * Normalise path
 *
 * @param {string} path
 * Path to normalise
 *
 * Replaces uuids, dates and build shas
 *
 * @return {string}
 */
// TODO: consider caching return value for path
const normalizePath = path => {
  const normalizedPath = path
    .replace(uuidRegex, ':uuid')
    .replace(dateRegex, ':date')
    .replace(authCallbackRegex, '$1=:code')
    .replace(lookupValueRegex, '$1=:lookup')
    .replace(assetRegex, '.:sha.$1')
  return normalizedPath
}

/**
 * Convert url to normalised path
 *
 * @param {string} url
 * URL to normalise
 *
 * @return {string}
 */
const normalizeUrlToPath = url => {
  return normalizePath(new URL(url).pathname)
}

const getDefaultLabels = config => {
  const { SENTRY, SERVER_HOST, API, APP_GIT_SHA, APP_VERSION, FEATURE_FLAGS } =
    config

  // add feature flags if any to labels
  const flags = Object.keys(FEATURE_FLAGS).reduce((acc, key) => {
    acc[`FEATURE_FLAG_${key}`] = FEATURE_FLAGS[key]
    return acc
  }, {})

  return {
    ENVIRONMENT: SENTRY.ENVIRONMENT,
    SERVER_HOST,
    API_VERSION: API.VERSION,
    APP_GIT_SHA,
    APP_VERSION,
    ...flags,
  }
}

/**
 * Initialise metrics
 *
 * @param {object} app
 * Express instance
 *
 * @param {object} config
 * Configuration object
 *
 * @return {undefined}
 */
const init = (app, config) => {
  const { PROMETHEUS } = config

  const mountpath = PROMETHEUS.MOUNTPATH

  if (!mountpath) {
    return
  }

  const defaultLabels = getDefaultLabels(config)

  const options = {
    accuracies: ['ms', 's'],
    defaultLabels,
    normalizePath,
  }

  app.use(promster.createMiddleware({ app, options }))

  prometheusClient = app.locals.Prometheus

  prometheusClient.register.setDefaultLabels(defaultLabels)

  app.use(mountpath, summaryRoute)
}

/**
 * Get Prometheus client
 *
 * @return {object} prometheusClient
 */
const getClient = () => {
  return prometheusClient
}

/**
 * Prometheus metrics route middleware
 */
const summaryRoute = (req, res, next) => {
  if (req.get('x-forwarded-host')) {
    const error = new Error('External metrics access')
    error.statusCode = 404
    return next(error)
  }

  const contentType = promster.getContentType()
  res.setHeader('Content-Type', contentType)

  promster
    .getSummary()
    .then(result => res.end(result))
    .catch(next)
}

module.exports = {
  init,
  getClient,
  summaryRoute,
  normalizePath,
  normalizeUrlToPath,
}
