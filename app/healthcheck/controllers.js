const { some } = require('lodash')

const {
  API,
  APP_BUILD_DATE,
  APP_BUILD_TAG,
  APP_BUILD_BRANCH,
  APP_GIT_SHA,
} = require('../../config')
const { version } = require('../../package.json')

// https://github.com/ministryofjustice/ping.json
const buildDetails = {
  build_date: APP_BUILD_DATE,
  build_tag: APP_BUILD_TAG,
  commit_id: APP_GIT_SHA,
  version_number: version,
  branch: APP_BUILD_BRANCH,
  api_version: API.VERSION,
}

module.exports = {
  get: (req, res) => {
    const { dependencies } = res
    const errors = some(dependencies, { status: 'Service unavailable' })
    const status = errors ? 'Service unavailable' : 'OK'

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.status(errors ? 503 : 200).json({
      status,
      dependencies,
      ...buildDetails,
    })
  },
  ping: (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.status(200).json(buildDetails)
  },
}
