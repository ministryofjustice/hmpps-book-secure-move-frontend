const wizard = require('hmpo-form-wizard')
const { get } = require('lodash')

const FormWizardController = require('../controllers/form-wizard')

module.exports = function uniqueFormWizard(steps, fields, config, uniqueKey) {
  return (req, res, next) => {
    if (typeof config !== 'function') {
      return wizard(steps, fields, {
        controller: FormWizardController,
        ...config,
      })(req, res, next)
    }

    const uniqueVal = get(req, uniqueKey)
    const uniqueConfig = uniqueVal ? config(uniqueVal) : config()

    return wizard(steps, fields, {
      controller: FormWizardController,
      ...uniqueConfig,
    })(req, res, next)
  }
}
