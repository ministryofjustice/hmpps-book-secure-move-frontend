const { parseISO, isValid, isAfter } = require('date-fns')
const { Controller } = require('hmpo-form-wizard')

module.exports = {
  after(value, date) {
    const test = parseISO(value)
    let comparator = new Date()

    if (arguments.length === 2 && Controller.validators.date(date)) {
      comparator = parseISO(date)
    }

    return (
      value === '' ||
      (Controller.validators.date(value) && isAfter(test, comparator))
    )
  },
  datetime(value) {
    return value === '' || isValid(parseISO(value))
  },
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
