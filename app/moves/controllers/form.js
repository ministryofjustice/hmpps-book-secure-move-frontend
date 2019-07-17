const { map, fromPairs } = require('lodash')
const { Controller } = require('hmpo-form-wizard')
const Sentry = require('@sentry/node')

const fieldHelpers = require('../../../common/helpers/field')

class FormController extends Controller {
  middlewareChecks () {
    super.middlewareChecks()
    this.use(this.checkCurrentLocation)
  }

  checkCurrentLocation (req, res, next) {
    if (!req.session.currentLocation) {
      const error = new Error(
        'Current location is not set. Check environment variable is correctly set.'
      )
      return next(error)
    }

    next()
  }

  getErrors (req, res) {
    const errors = super.getErrors(req, res)

    errors.errorList = map(errors, error => {
      const label = req.t(`fields:${error.key}.label`)
      const message = req.t(`validation:${error.type}`)

      return {
        text: `${label} ${message}`,
        href: `#${error.key}`,
      }
    })

    return errors
  }

  errorHandler (err, req, res, next) {
    if (err.redirect) {
      return res.redirect(err.redirect)
    }

    if (err.code === 'SESSION_TIMEOUT') {
      return res.render('form-wizard-timeout', {
        journeyBaseUrl: req.baseUrl,
      })
    }

    if (err.statusCode === 422) {
      Sentry.withScope(scope => {
        scope.setExtra('errors', err.errors)
        Sentry.captureException(err)
      })
    }

    super.errorHandler(err, req, res, next)
  }

  render (req, res, next) {
    const fields = Object.entries(req.form.options.fields)
      .map(fieldHelpers.setFieldValue(req.form.values))
      .map(fieldHelpers.setFieldError(req.form.errors, req.t))
      .map(fieldHelpers.translateField(req.t))
      .map(fieldHelpers.renderConditionalFields)

    req.form.options.fields = fromPairs(fields)

    super.render(req, res, next)
  }
}

module.exports = FormController
