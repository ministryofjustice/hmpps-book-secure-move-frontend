const Sentry = require('@sentry/node')
const { Controller } = require('hmpo-form-wizard')
const { map, fromPairs, get } = require('lodash')
const { compile } = require('path-to-regexp')

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

  getUpdateBackStepUrl(req, res) {
    let returnUrl = req.form.options.updateBackStep
    if (returnUrl && returnUrl.includes(':')) {
      const toPath = compile(returnUrl)
      returnUrl = toPath(res.locals)
    }
    return returnUrl
  }

  getValues(req, res, callback) {
    return super.getValues(req, res, (err, values) => {
      if (err) {
        return callback(err)
      }

      try {
        if (req.form.options.update) {
          values = Object.assign(values, this.getUpdateValues(req, res))
          this.protectUpdateFields(req, res, values)
        }
      } catch (error) {
        return callback(error)
      }

      callback(null, values)
    })
  }

  protectUpdateFields(req, res, values) {
    if (!req.form.options.update) {
      return
    }
    const fields = req.form.options.fields || {}
    Object.keys(fields).forEach(key => {
      const field = fields[key]
      if (field.readOnly && values[key] !== undefined && values[key] !== null) {
        fields[key] = {
          ...field,
          ...field.updateComponent,
          value: values[key],
        }
      }
    })
  }

  getUpdateValues(req, res) {
    return {}
  }

  hasOptions(req, options = []) {
    options = Array.isArray(options) ? options : [options]
    const formOptions = get(req, 'form.options', {})
    const optionsDefined = options.filter(option => formOptions[option])
    return optionsDefined.length === options.length
  }

  successHandler(req, res, next) {
    if (this.hasOptions(req, ['update', 'updateBackStep'])) {
      try {
        req.journeyModel.reset()
        req.sessionModel.reset()

        const redirectUrl = this.getUpdateBackStepUrl(req, res, next)
        return res.redirect(redirectUrl)
      } catch (err) {
        return next(err)
      }
    }
    super.successHandler(req, res, next)
  }

  render(req, res, next) {
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
