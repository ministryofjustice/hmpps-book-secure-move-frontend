const Sentry = require('@sentry/node')
const { Controller } = require('hmpo-form-wizard')
const { map, fromPairs, forEach, mapKeys } = require('lodash')

const fieldHelpers = require('../../helpers/field')

class BaseController extends Controller {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setInitialValues)
    this.use(this.setupAddMultipleFieldsValues)
    this.use(this.setupAddMultipleFields)
    this.use(this.setupConditionalFields)
    this.use(this.setFieldContext)
  }

  setInitialValues(req, res, next) {
    next()
  }

  setupAddMultipleFieldsValues(req, res, next) {
    const values = req.sessionModel.toJSON()
    const { fields } = req.form.options

    const addAnotherProps = Object.keys(fields).filter(
      key => fields[key].component === 'appAddAnother'
    )

    addAnotherProps.forEach(fieldName => {
      const fieldValues =
        req.body?.[fieldName] || values.errorValues?.[fieldName]

      if (fieldValues) {
        req.sessionModel.set(fieldName, fieldValues)
      }
    })

    next()
  }

  setupAddMultipleFields(req, res, next) {
    const { allFields, fields } = req.form.options
    const values = req.sessionModel.toJSON()
    const itemFields = Object.entries(fields).reduce(
      fieldHelpers.reduceAddAnotherFields(allFields, values),
      {}
    )

    req.form.options.fields = {
      ...fields,
      ...itemFields,
    }

    next()
  }

  setupConditionalFields(req, res, next) {
    const { allFields, fields } = req.form.options
    const stepFieldsArray = Object.entries(fields)
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
    const { fields } = req.form.options

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
    const { fields } = req.form.options
    Object.keys(fields).forEach(fieldKey => {
      fields[fieldKey].context = req.form.options.key
    })

    next()
  }

  getErrors(req, res) {
    const errors = super.getErrors(req, res)
    const { fields } = req.form.options
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
        'EBADCSRFTOKEN',
        'MISSING_PREREQ',
        'MISSING_LOCATION',
      ].includes(err.code)
    ) {
      if (err.code === 'CSRF_ERROR' || err.code === 'EBADCSRFTOKEN') {
        Sentry.captureException(err)
      }

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
    const fieldsEntries = Object.entries(req.form.options.fields)
      .map(fieldHelpers.setFieldValue(req.form.values))
      .map(fieldHelpers.setFieldError(req.form.errors))
      .map(fieldHelpers.translateField)
      .map(fieldHelpers.renderConditionalFields)
      .map(fieldHelpers.renderAddAnotherFields)

    req.form.options.fields = fromPairs(fieldsEntries)

    super.render(req, res, next)
  }
}

let FormController = BaseController
FormController = require('./mixins/csrf')(FormController)

module.exports = FormController
