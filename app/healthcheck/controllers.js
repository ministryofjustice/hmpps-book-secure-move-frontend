const { some } = require('lodash')

const {
  API,
  APP_BUILD_DATE,
  APP_BUILD_TAG,
  APP_BUILD_BRANCH,
  APP_BUILD_NUMBER,
  APP_GIT_SHA,
  APP_NAME,
  APP_VERSION,
  PRODUCT_ID,
} = require('../../config')

const UNAVAILABLE = 'Service unavailable'

// https://github.com/ministryofjustice/ping.json
const buildDetails = {
  build_date: APP_BUILD_DATE,
  build_tag: APP_BUILD_TAG,
  commit_id: APP_GIT_SHA,
  version_number: APP_VERSION,
  branch: APP_BUILD_BRANCH,
  api_version: API.VERSION,
}

function setNoCache(res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
}

module.exports = {
  get: (req, res) => {
    const { dependencies } = res
    const errors = some(dependencies, { status: UNAVAILABLE })
    const status = errors ? UNAVAILABLE : 'OK'

    setNoCache(res)
    res.status(errors ? 503 : 200).json({
      status,
      dependencies,
      ...buildDetails,
    })
  },
  ping: (req, res) => {
    setNoCache(res)
    res.status(200).json(buildDetails)
  },
  // HMPPS standard health endpoint, as used by the Developer Portal
  health: (req, res) => {
    const { dependencies = [] } = res
    const components = Object.fromEntries(
      dependencies.map(({ name, status, error }) => [
        name,
        {
          status: status === UNAVAILABLE ? 'DOWN' : 'UP',
          details: error || status,
        },
      ])
    )
    const status = some(components, { status: 'DOWN' }) ? 'DOWN' : 'UP'

    setNoCache(res)
    // Matches @ministryofjustice/hmpps-monitoring, which returns 500 when DOWN
    res.status(status === 'UP' ? 200 : 500).json({
      status,
      components,
      build: {
        buildNumber: APP_BUILD_NUMBER,
        gitRef: APP_GIT_SHA,
      },
      version: APP_BUILD_NUMBER,
      uptime: Math.floor(process.uptime()),
    })
  },
  // HMPPS standard info endpoint, as used by the Developer Portal drift radiator
  info: (req, res) => {
    setNoCache(res)
    res.status(200).json({
      git: {
        branch: APP_BUILD_BRANCH,
        commit: {
          id: APP_GIT_SHA,
        },
      },
      build: {
        artifact: APP_NAME,
        name: APP_NAME,
        version: APP_BUILD_NUMBER,
      },
      productId: PRODUCT_ID,
      uptime: Math.floor(process.uptime()),
    })
  },
}
