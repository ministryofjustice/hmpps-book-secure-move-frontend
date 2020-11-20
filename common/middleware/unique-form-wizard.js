const wizard = require('hmpo-form-wizard')
const { get } = require('lodash')

module.exports = function uniqueFormWizard(steps, fields, config, uniqueKey) {
  return (req, res, next) => {
    if (typeof config !== 'function') {
      return wizard(steps, fields, config)(req, res, next)
    }

    const uniqueVal = get(req, uniqueKey)
    const uniqueConfig = uniqueVal ? config(uniqueVal) : config()

    return wizard(steps, fields, uniqueConfig)(req, res, next)
  }
}
