const {
  format,
  parse: parseDate,
  isValid: isValidDate,
} = require('date-fns')

const {
  DATE_FORMATS,
} = require('../index')

/**
 * Formats a date into the desired string format
 *
 * @param  {Any} a any type
 * @param  {String} a string date format to return
 * @return {String} a formatted date
 *
 * @example {{ "2019-02-21" | formatDate }}
 * @example {{ "2019-02-21" | formatDate("DD/MM/YY") }}
 */
function formatDate (value, formattedDateStr = DATE_FORMATS.LONG) {
  if (!value) {
    return value
  }
  const parsedDate = parseDate(value)

  if (!isValidDate(parsedDate)) { return value }
  return format(parsedDate, formattedDateStr)
}

/**
 * Formats a date to the long date format including day
 *
 * @param  {Any} a any type
 * @return {String} a formatted date with the day
 *
 * @example {{ "2019-02-21" | formatDateWithDay }}
 */
function formatDateWithDay (value) {
  return formatDate(value, DATE_FORMATS.WITH_DAY)
}

module.exports = {
  formatDate,
  formatDateWithDay,
}
