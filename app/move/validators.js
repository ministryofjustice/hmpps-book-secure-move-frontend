const { Controller } = require('hmpo-form-wizard')

module.exports = {
  time(value) {
    return (
      value === '' ||
      Controller.validators.regex(
        value,
        /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]) ?([AaPp][Mm])?$/
      )
    )
  },
}
