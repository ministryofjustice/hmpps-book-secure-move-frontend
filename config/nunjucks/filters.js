const {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  differenceInYears,
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

/**
 * Returns today, tomorrow or yesterday if they match, otherwise
 * it will return that date formatted with day by default or in
 * the format supplied
 *
 * @param  {Any} a any type
 * @return {String} a formatted date
 *
 * @example {{ "2019-02-21" | formatDateAsRelativeDay }}
 * @example {{ "2019-02-21" | formatDateAsRelativeDay("DD/MM/YYYY") }}
 */
function formatDateAsRelativeDay (value, formattedDateStr = DATE_FORMATS.WITH_DAY) {
  if (isToday(value)) {
    return 'Today'
  }

  if (isTomorrow(value)) {
    return 'Tomorrow'
  }

  if (isYesterday(value)) {
    return 'Yesterday'
  }

  return formatDate(value, formattedDateStr)
}

/**
 * Returns an age based on a date
 * @param  {Any} a any type
 * @return {String} an age as a string
 * @example {{ "2000-02-21" | calculateAge }}
 */
function calculateAge (value) {
  const parsedDate = parseDate(value)

  if (!isValidDate(parsedDate)) { return value }
  return differenceInYears(new Date(), parsedDate)
}

/**
 * Formats a time
 *
 * @param  {Any} a datetime
 * @return {String} a formatted time as string
 * @example {{ "2000-01-01T14:00:00Z" | formatTime }}
 */
function formatTime (value) {
  const parsedDate = parseDate(value)

  if (!isValidDate(parsedDate)) {
    return value
  }

  const hours = format(parsedDate, 'h')
  const parsedMins = format(parsedDate, 'mm')
  const minutes = parsedMins !== '00' ? `:${parsedMins}` : ''
  const suffix = format(parsedDate, 'a')
  const timeStr = `${hours}${minutes}${suffix}`

  if (timeStr === '12am') {
    return 'Midnight'
  }

  if (timeStr === '12pm') {
    return 'Midday'
  }

  return `${hours}${minutes}${suffix}`
}

module.exports = {
  formatDate,
  formatDateWithDay,
  formatDateAsRelativeDay,
  calculateAge,
  formatTime,
}
