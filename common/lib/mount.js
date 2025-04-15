const fs = require('fs')
const path = require('path')

const debug = require('debug')('app:mount')
const express = require('express')

const mount = dir => {
  const router = express.Router()
  const subApps = fs.readdirSync(dir, { withFileTypes: true })

  const appRouters = subApps
    .filter(dirent => dirent.isDirectory())
    .filter(({ name }) => fs.existsSync(path.resolve(dir, name, 'index.js')))
    // eslint-disable-next-line array-callback-return
    .map(({ name }) => {
      debug('Loading app:', name)

      const subApp = require(path.resolve(dir, name))

      if (subApp.router && !subApp.skip) {
        debug('Loading router:', name)

        if (subApp.mountpath) {
          return router.use(subApp.mountpath, subApp.router)
        }

        return router.use(subApp.router)
      } else {
        debug('Skipping router:', name)
      }
    })
    .filter(used => used)

  return appRouters.length ? appRouters : (req, res, next) => next()
}

module.exports = mount
