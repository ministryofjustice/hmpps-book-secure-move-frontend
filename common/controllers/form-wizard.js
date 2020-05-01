const Sentry = require('@sentry/node')
const { Controller } = require('hmpo-form-wizard')
const { map, fromPairs } = require('lodash')

const fieldHelpers = require('../helpers/field')

class FormController extends Controller {
  getErrors(req, res) {
    const errors = super.getErrors(req, res)

    errors.errorList = map(errors, error => {
      const label = req.t(`fields::${error.key}.label`)
      const message = req.t(`validation::${error.type}`)

      return {
        html: `${label} ${message}`,
        href: `#${error.key}`,
      }
    })

    return errors
  }

  errorHandler(err, req, res, next) {
    if (err.redirect) {
      return res.redirect(err.redirect)
    }

    if (
      ['SESSION_TIMEOUT', 'MISSING_PREREQ', 'MISSING_LOCATION'].includes(
        err.code
      )
    ) {
      return res.render('form-wizard-error', {
        journeyName: req.form.options.journeyName.replace('-', '_'),
        journeyBaseUrl: req.baseUrl,
        errorKey: err.code.toLowerCase(),
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

  render(req, res, next) {
    const fields = Object.entries(req.form.options.fields)
      .map(fieldHelpers.setFieldValue(req.form.values))
      .map(fieldHelpers.setFieldError(req.form.errors))
      .map(fieldHelpers.translateField)
      .map(fieldHelpers.renderConditionalFields)

    req.form.options.fields = fromPairs(fields)

    super.render(req, res, next)
  }
}

module.exports = FormController
