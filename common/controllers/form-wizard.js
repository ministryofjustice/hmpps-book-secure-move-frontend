const Sentry = require('@sentry/node')
const { Controller } = require('hmpo-form-wizard')
const { map, fromPairs, forEach, mapKeys } = require('lodash')

const fieldHelpers = require('../helpers/field')

class FormController extends Controller {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setInitialValues)
    this.use(this.setupArbitraryMultipleFields)
    this.use(this.setupAddMultipleFields)
    this.use(this.setupConditionalFields)
    this.use(this.setFieldContext)
  }

  setInitialValues(req, res, next) {
    next()
  }

  setupArbitraryMultipleFields(req, res, next) {
    if (req.method === 'POST') {
      const addAnotherProps = Object.keys(req.form.options.fields).filter(
        key => req.form.options.fields[key].component === 'appAddAnother'
      )

      const values = req.sessionModel.toJSON()

      addAnotherProps.forEach(fieldName => {
        const itemsLength = req.body[fieldName].length

        // add items
        while (values[fieldName].length < itemsLength) {
          req.multipleFieldAdded = true
          values[fieldName].push({})
        }

        // remove items
        values[fieldName].length = itemsLength
      })

      req.sessionModel.set(values)
    }

    next()
  }

  setupAddMultipleFields(req, res, next) {
    const allFields = req.form.options.allFields
    const values = req.sessionModel.toJSON()
    const itemFields = Object.entries(req.form.options.fields).reduce(
      fieldHelpers.reduceAddAnotherFields(allFields, values),
      {}
    )
    req.form.options.fields = {
      ...req.form.options.fields,
      ...itemFields,
    }

    next()
  }

  setupConditionalFields(req, res, next) {
    const allFields = req.form.options.allFields
    const stepFieldsArray = Object.entries(req.form.options.fields)
    const stepFields = stepFieldsArray.map(
      fieldHelpers.flattenConditionalFields
    )
    const dependentFields = stepFieldsArray.reduce(
      fieldHelpers.reduceDependentFields(allFields),
      {}
    )

    req.form.options.fields = {
      ...fromPairs(stepFields),
      ...dependentFields,
    }

    next()
  }

  post(req, res, next) {
    const isMultipleAction = req.body['multiple-action']
    const fields = req.form.options.fields

    if (isMultipleAction) {
      const [action, key, index] = isMultipleAction.split('::')
      req.body[key] = req.body[key] || []

      if (action === 'add') {
        // push empty object to create new item group
        req.body[key].push({})
      }

      if (action === 'remove') {
        req.body[key].splice(index, 1)
      }
    }

    forEach(fields, (options, key) => {
      if (options.component === 'appAddAnother') {
        const itemValues = (req.body[key] || []).reduce((acc, item, index) => {
          return {
            ...acc,
            ...mapKeys(item, (v, k) => `${key}[${index}][${k}]`),
          }
        }, {})

        req.body = {
          ...req.body,
          ...itemValues,
        }
      }
    })

    super.post(req, res, next)
  }

  process(req, res, next) {
    const isMultipleAction = req.body['multiple-action']

    if (isMultipleAction) {
      // Need to bypass the validation when adding/removing items
      return super.saveValues(req, res, () =>
        res.redirect(req.form.options.fullPath)
      )
    }

    next()
  }

  setFieldContext(req, res, next) {
    Object.keys(req.form.options.fields).forEach(fieldKey => {
      req.form.options.fields[fieldKey].context = req.form.options.key
    })

    next()
  }

  getErrors(req, res) {
    const errors = super.getErrors(req, res)
    const fields = req.form.options.fields
    const errorList = map(errors, error => {
      return {
        html: fieldHelpers.getFieldErrorMessage({
          ...fields[error.key],
          ...error,
        }),
        href: `#${fields[error.key].id}`,
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
      .map(fieldHelpers.renderAddAnotherFields)

    req.form.options.fields = fromPairs(fields)

    super.render(req, res, next)
  }
}

module.exports = FormController
