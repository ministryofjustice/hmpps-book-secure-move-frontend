import fs from 'fs'
import path from 'path'

import { Router, NextFunction, RequestHandler } from 'express'

import checkStaffNetwork from '../middleware/check-staff-network'
import { BasmRequest } from '../types/basm_request'
import { BasmResponse } from '../types/basm_response'

const debug = require('debug')('app:mount')

const mount = (dir: string) => {
  const router = Router()
  const subApps = fs.readdirSync(dir, { withFileTypes: true })

  // This cast is necessary because eslint moans about the Request/Response being the wrong type
  router.use(checkStaffNetwork as unknown as RequestHandler)

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

  return appRouters.length
    ? appRouters
    : (_req: BasmRequest, _res: BasmResponse, next: NextFunction) => next()
}

module.exports = mount
