const { parseISO, isValid, isAfter } = require('date-fns')
const { Controller } = require('hmpo-form-wizard')

function isPNCNumberValid(value) {
  value = (value || '').toString().toUpperCase()
  const regex = /^([0-9]{2}|[0-9]{4})\/[0-9]+[a-zA-Z]$/i
  const mod23chars = 'ZABCDEFGHJKLMNPQRTUVWXY'.split('')

  if (!Controller.validators.regex(value, regex)) {
    return false
  }

  /* Use CJSE Data Standards Catalogue v4.3, section 3.374 */
  const [year, number] = value.split('/')
  const checkDigit = value.substr(-1)
  const derivedPNC = `${year.substr(-2)}${number
    .substr(0, number.length - 1)
    .padStart(7, '0')}`
  const i = Number.parseInt(derivedPNC) % 23

  if (mod23chars[i] !== checkDigit) {
    return false
  }

  return true
}

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
  datetime(value) {
    return value === '' || isValid(parseISO(value))
  },
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
  moveReference(value) {
    return (
      value === '' ||
      Controller.validators.regex(value, /^[A-Za-z]{3}[1-9]{4}[A-Za-z]{1}$/i)
    )
  },
  prisonNumber(value) {
    return (
      value === '' ||
      Controller.validators.regex(value, /^[A-Z][0-9]{4}[A-Z]{2}$/i)
    )
  },
  policeNationalComputerNumber(value) {
    return value === '' || isPNCNumberValid(value)
  },
}
