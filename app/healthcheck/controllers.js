const { some } = require('lodash')

const { BUILD_DATE, BUILD_BRANCH, GIT_SHA } = require('../../config')
const { version } = require('../../package.json')

module.exports = {
  get: (req, res) => {
    const { dependencies } = res
    const errors = some(dependencies, { status: 'Service unavailable' })
    const status = errors ? 'Service unavailable' : 'OK'

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.status(errors ? 503 : 200).json({
      buildDate: BUILD_DATE,
      buildTag: BUILD_BRANCH,
      dependencies,
      gitSha: GIT_SHA,
      status,
      version,
    })
  },
  ping: (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.status(200).send('OK')
  },
}
