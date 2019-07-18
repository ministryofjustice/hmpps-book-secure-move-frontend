const router = require('express').Router()
const fs = require('fs')

const subApps = fs.readdirSync(__dirname)

const appRouters = subApps.map(subAppDir => {
  const subApp = require(`./${subAppDir}`)

  if (subApp.router && !subApp.skip) {
    if (subApp.mountpath) {
      return router.use(subApp.mountpath, subApp.router)
    }

    return router.use(subApp.router)
  }

  return (req, res, next) => next()
})

module.exports = appRouters
