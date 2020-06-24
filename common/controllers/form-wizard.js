const Sentry = require('@sentry/node')
const { Controller } = require('hmpo-form-wizard')
const { flatten, map, fromPairs, forEach } = require('lodash')

const fieldHelpers = require('../helpers/field')

class FormController extends Controller {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setupConditionalFields)
  }

  setupConditionalFields(req, res, next) {
    const allFields = req.form.options.allFields
    const stepFields = req.form.options.fields
    const dependentFields = {}

    forEach(stepFields, (field, fieldName) => {
      if (!field.items) {
        return
      }

      field.items.forEach(item => {
        const conditionalFields = flatten([item.conditional || []])

        conditionalFields.forEach(key => {
          const conditionalField = allFields[key]

          if (!conditionalField) {
            return
          }

          dependentFields[key] = {
            ...conditionalField,
            // tell the form wizard to not output field initially as it will be nested
            skip: true,
            // set dependent object for validation
            dependent: {
              field: fieldName,
              value: item.value,
            },
          }
        })
      })
    })

    req.form.options.fields = {
      ...stepFields,
      ...dependentFields,
    }

    next()
  }

  getErrors(req, res) {
    const errors = super.getErrors(req, res)
    const errorList = map(errors, ({ key, type }) => {
      return {
        html: fieldHelpers.getFieldErrorMessage(key, type),
        href: `#${key}`,
      }
    })

    return {
      ...errors,
      errorList,
    }
  }

  errorHandler(err, req, res, next) {
    if (err.redirect) {
      return res.redirect(err.redirect)
    }

    if (
      [
        'SESSION_TIMEOUT',
        'CSRF_ERROR',
        'MISSING_PREREQ',
        'MISSING_LOCATION',
      ].includes(err.code)
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
