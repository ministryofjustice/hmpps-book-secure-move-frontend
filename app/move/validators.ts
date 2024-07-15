const { parseISO, isValid, isAfter } = require('date-fns')
const { Controller } = require('hmpo-form-wizard')

function isPNCNumberValid(value: string) {
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

  return mod23chars[i] === checkDigit
}

export function time(value: string) {
  return (
    value === '' ||
    Controller.validators.regex(
      value,
      /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]) ?([AaPp][Mm])?$/
    )
  )
}

export function datetime(value: string) {
  return typeof value === 'string' && (value === '' || isValid(parseISO(value)))
}

export function after1900(value: string) {
  return after(value, '1900-01-01')
}
export function after(value: string, date?: string) {
  const test = parseISO(value)
  let comparator = new Date()

  if (arguments.length === 2 && Controller.validators.date(date)) {
    if (date != null) {
      comparator = parseISO(date)
    }
  }

  return (
    value === '' ||
    (Controller.validators.date(value) && isAfter(test, comparator))
  )
}

export function prisonNumber(value: string) {
  return (
    value === '' ||
    Controller.validators.regex(value, /^[A-Z][0-9]{4}[A-Z]{2}$/i)
  )
}

export function policeNationalComputerNumber(value: string) {
  return value === '' || isPNCNumberValid(value)
}

export function number(value: string) {
  return value !== null && value !== '' && Number.isFinite(Number(value))
}

export function positive(value: string) {
  return Number(value) > 0
}
