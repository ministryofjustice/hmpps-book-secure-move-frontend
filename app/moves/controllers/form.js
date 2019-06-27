const { map, fromPairs } = require('lodash')
const { Controller } = require('hmpo-form-wizard')

const fieldHelpers = require('../../../common/helpers/field')

class FormController extends Controller {
  getErrors (req, res) {
    const errors = super.getErrors(req, res)

    errors.errorList = map(errors, (error) => {
      return {
        text: `${error.key} ${error.type}`,
        href: `#${error.key}-error`,
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

    super.errorHandler(err, req, res, next)
  }

  render (req, res, next) {
    const fields = Object.entries(req.form.options.fields)
      .map(fieldHelpers.setFieldValue(req.form.values))
      .map(fieldHelpers.translateField(req.translate))
      .map(fieldHelpers.renderConditionalFields)

    req.form.options.fields = fromPairs(fields)

    super.render(req, res, next)
  }
}

module.exports = FormController
