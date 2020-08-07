const fs = require('fs')

const debug = require('debug')('app:router')
const router = require('express').Router()

const subApps = fs.readdirSync(__dirname, { withFileTypes: true })

const appRouters = subApps
  .filter(dirent => dirent.isDirectory())
  .map(({ name }) => {
    const subApp = require(`./${name}`)
    debug('Loading app:', name)

    if (subApp.router && !subApp.skip) {
      debug('Loading router:', name)

      if (subApp.mountpath) {
        return router.use(subApp.mountpath, subApp.router)
      }

      return router.use(subApp.router)
    }

    debug('Skipping router:', name)

    return (req, res, next) => next()
  })

module.exports = appRouters
