const csrf = require('csurf')
const { includes } = require('lodash')

const safeMethods = ['GET', 'HEAD', 'OPTIONS']

module.exports = Controller =>
  class extends Controller {
    middlewareSetup() {
      super.middlewareSetup()
      this.use(csrf())
    }

    csrfGenerateSecret(req, res, next) {
      next()
    }

    csrfCheckToken(req, res, next) {
      next()
    }

    csrfSetToken(req, res, next) {
      if (!includes(safeMethods, req.method)) {
        return next()
      }

      // The HTTP method is safe. No need to verify a
      // token. Instead, provide a new one for future
      // verification.
      res.locals['csrf-token'] = req.csrfToken()

      next()
    }
  }
