const mojFilters = require('@ministryofjustice/frontend/moj/filters/all')()
const {
  format,
  isThisWeek,
  isToday,
  isTomorrow,
  isYesterday,
  differenceInYears,
  parseISO,
  isValid: isValidDate,
  isSameMonth,
  isSameYear,
  isDate,
} = require('date-fns')
const filesizejs = require('filesize')
const { filter, kebabCase, startCase } = require('lodash')
const pluralize = require('pluralize')

const parse = require('../../common/parsers')
const i18n = require('../i18n')
const { DATE_FORMATS } = require('../index')

function _isRelativeDate(date) {
  const parsedDate = parseISO(date)

  return (
    isToday(parsedDate) || isTomorrow(parsedDate) || isYesterday(parsedDate)
  )
}

function _isCurrentWeek(date) {
  const options = { weekStartsOn: 1 }
  const [startDate, endDate] = date.map(date =>
    isDate(date) ? date : parseISO(date)
  )
  return isThisWeek(startDate, options) && isThisWeek(endDate, options)
}

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
function formatDate(value, formattedDateStr = DATE_FORMATS.LONG) {
  if (!value) {
    return value
  }

  const date = isDate(value) ? value : parseISO(value)

  if (!isValidDate(date)) {
    return value
  }

  return format(date, formattedDateStr)
}

/**
 * Formats an array of dates into the desired string format
 *
 * With multiple dates it will join them using `to`
 *
 * @param  {Any} a any type
 * @param  {String} a string date format to return
 * @return {String} a formatted date
 *
 * @example {{ "2019-02-21" | formatDateRange }}
 * @example {{ ["2019-02-21"] | formatDateRange }}
 * @example {{ ["2019-02-21", "2019-02-28"] | formatDateRange }}
 * @example {{ "2019-02-21" | formatDateRange("DD/MM/YY") }}
 */
function formatDateRange(value, delimiter = 'to') {
  const dates = filter(value)

  if (!value || !Array.isArray(value) || dates.length === 0) {
    return value
  }

  if (dates.length === 1) {
    return formatDate(dates[0])
  }

  const [startDate, endDate] = dates.map(date =>
    isDate(date) ? date : parseISO(date)
  )

  const yearFormat = isSameYear(startDate, endDate) ? '' : ' yyyy'
  const monthFormat = isSameMonth(startDate, endDate) ? '' : ' MMM'
  const formattedStartDate = formatDate(
    startDate,
    `d${monthFormat}${yearFormat}`
  )
  const formattedEndDate = formatDate(endDate)

  return `${formattedStartDate} ${delimiter} ${formattedEndDate}`
}

/**
 * Formats an array of dates into the desired string format
 *
 * With multiple dates it will join them using `to`
 *
 * @param  {Any} a any type
 * @param  {String} a string date format to return
 * @return {String} a formatted date
 *
 * @example {{ "2019-02-21" | formatDateRange }}
 * @example {{ ["2019-02-21"] | formatDateRange }}
 * @example {{ ["2019-02-21", "2019-02-28"] | formatDateRange }}
 * @example {{ "2019-02-21" | formatDateRange("DD/MM/YY") }}
 */
function formatDateRangeAsRelativeWeek(value) {
  const dates = filter(value)

  if (!value || !Array.isArray(value) || dates.length === 0) {
    return value
  }

  if (dates.length === 1) {
    return formatDate(dates[0])
  }

  if (_isCurrentWeek(dates)) {
    return i18n.t('actions::current_week')
  }

  return formatDateRange(value)
}

function formatISOWeek(dateRange) {
  if (!Array.isArray(dateRange) || dateRange.length !== 2) {
    return dateRange
  }

  const [startDate, endDate] = dateRange
  return startDate === endDate
    ? startDate
    : format(parseISO(startDate), "yyyy-'W'II")
}

/**
 * Formats a date to the long date format including day
 *
 * @param  {Any} a any type
 * @return {String} a formatted date with the day
 *
 * @example {{ "2019-02-21" | formatDateWithDay }}
 */
function formatDateWithDay(value) {
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
function formatDateAsRelativeDay(
  value,
  formattedDateStr = DATE_FORMATS.WITH_DAY
) {
  if (isToday(parseISO(value))) {
    return 'Today'
  }

  if (isTomorrow(parseISO(value))) {
    return 'Tomorrow'
  }

  if (isYesterday(parseISO(value))) {
    return 'Yesterday'
  }

  return formatDate(value, formattedDateStr)
}

/**
 * Returns current date formatted with day along with
 * today, tomorrow or yesterday in brackets if they match
 *
 * @param  {Any} a any type
 *
 * @example {{ "2019-02-21" | formatDateWithRelativeDay }}
 */
function formatDateWithRelativeDay(value) {
  if (!value) {
    return value
  }

  const dateWithDay = formatDateWithDay(value)

  return _isRelativeDate(value)
    ? `${dateWithDay} (${formatDateAsRelativeDay(value)})`
    : dateWithDay
}

/**
 * Returns current date formatted with week along with
 * this week in brackets (when applicable)
 *
 * @param  {Any} a any type
 *
 * @example {{ ["2019-02-21", "2019-02-28"] | formatDateRangeWithRelativeWeek }}
 */
function formatDateRangeWithRelativeWeek(value) {
  const dates = filter(value)

  if (!value || !Array.isArray(value) || dates.length === 0) {
    return value
  }

  if (dates.length === 1) {
    return formatDate(dates[0])
  }

  const dateWithWeek = formatDateRange(value)

  return _isCurrentWeek(dates)
    ? `${dateWithWeek} (${formatDateRangeAsRelativeWeek(value)})`
    : dateWithWeek
}

/**
 * Returns an age based on a date
 * @param  {Any} a any type
 * @return {String} an age as a string
 * @example {{ "2000-02-21" | calculateAge }}
 */
function calculateAge(value) {
  const parsedDate = parseISO(value)

  if (!isValidDate(parsedDate)) {
    return value
  }

  return differenceInYears(new Date(), parsedDate)
}

/**
 * Formats a time
 *
 * @param  {Any} a datetime
 * @return {String} a formatted time as string
 * @example {{ "2000-01-01T14:00:00Z" | formatTime }}
 */
function formatTime(value) {
  const parsedDate = parse.date(value)

  if (!value || !isValidDate(parsedDate)) {
    return value
  }

  const hours = format(parsedDate, 'h')
  const parsedMins = format(parsedDate, 'mm')
  const minutes = parsedMins !== '00' ? `:${parsedMins}` : ''
  const suffix = format(parsedDate, 'a').toLowerCase()
  const timeStr = `${hours}${minutes}${suffix}`

  if (timeStr === '12am') {
    return 'Midnight'
  }

  return `${hours}${minutes}${suffix}`
}

/**
 * Join a list of items using commas and `and` as
 * the final join
 *
 * @param  {Array} an array of items to join
 * @param  {String} last delimiter to use
 * @return {String} items joined using commas and the last delimiter
 * @example {{ ["one","two","three"] | oxfordJoin }}
 */
function oxfordJoin(arr = [], lastDelimiter = 'and') {
  if (arr.length === 0) {
    return ''
  }

  if (arr.length === 1) {
    return arr[0]
  }

  if (arr.length === 2) {
    // joins all with "and" but no commas
    return arr.join(` ${lastDelimiter} `)
  }

  // joins all with commas, but last one gets ", and" (oxford comma!)
  return `${arr.slice(0, -1).join(', ')}, ${lastDelimiter} ${arr.slice(-1)}`
}

function filesize(str) {
  return filesizejs(str, {
    round: 0,
  })
}

module.exports = {
  ...mojFilters,
  formatDate,
  formatDateRange,
  formatDateRangeAsRelativeWeek,
  formatDateRangeWithRelativeWeek,
  formatDateWithDay,
  formatDateWithRelativeDay,
  formatDateAsRelativeDay,
  formatISOWeek,
  calculateAge,
  formatTime,
  kebabcase: kebabCase,
  startCase,
  pluralize,
  oxfordJoin,
  filesize,
}
