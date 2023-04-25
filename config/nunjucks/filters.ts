import {
  differenceInYears,
  format,
  isDate,
  isSameMonth,
  isSameYear,
  isThisWeek,
  isToday,
  isTomorrow,
  isValid as isValidDate,
  isYesterday,
  parseISO,
  subDays,
  addDays,
} from 'date-fns'
import { filesize as filesizejs } from 'filesize'
import { filter } from 'lodash'
import pluralizejs from 'pluralize'

export const pluralize = pluralizejs
export { kebabCase, startCase } from 'lodash'

const mojFilters = require('@ministryofjustice/frontend/moj/filters/all')()

const { DATE_FORMATS } = require('../index')

function _parseDate(date: Date | string) {
  return isDate(date) ? (date as Date) : parseISO(date as string)
}

function _isRelativeDate(date: string | Date) {
  const parsedDate = _parseDate(date)

  return (
    isToday(parsedDate) || isTomorrow(parsedDate) || isYesterday(parsedDate)
  )
}

function _isCurrentWeek(dates: (Date | string)[]) {
  const options: {
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
  } = { weekStartsOn: 1 }
  const [startDate, endDate] = dates.map(_parseDate)
  return isThisWeek(startDate, options) && isThisWeek(endDate, options)
}

function _isNextWeek(dates: (Date | string)[]) {
  return _isCurrentWeek(dates.map(date => subDays(_parseDate(date), 7)))
}

function _isLastWeek(dates: (Date | string)[]) {
  return _isCurrentWeek(dates.map(date => addDays(_parseDate(date), 7)))
}

/**
 * Formats a date into the desired string format
 *
 * @return {String} a formatted date
 *
 * @example {{ "2019-02-21" | formatDate }}
 * @example {{ "2019-02-21" | formatDate('DD/MM/YY') }}
 * @param value
 * @param formattedDateStr
 */
export function formatDate(
  value: string | Date,
  formattedDateStr = DATE_FORMATS.LONG
) {
  if (!value) {
    return value
  }

  const date = _parseDate(value)

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
 * @return {String} a formatted date
 *
 * @example {{ "2019-02-21" | formatDateRange }}
 * @example {{ ['2019-02-21'] | formatDateRange }}
 * @example {{ ["2019-02-21", "2019-02-28"] | formatDateRange }}
 * @example {{ "2019-02-21" | formatDateRange('DD/MM/YY') }}
 * @param value
 * @param delimiter
 */
export function formatDateRange(value: string | string[], delimiter = 'to') {
  const dates = filter(value)

  if (!value || !Array.isArray(value) || dates.length === 0) {
    return value
  }

  if (dates.length === 1) {
    return formatDate(dates[0])
  }

  const [startDate, endDate] = dates.map(_parseDate)

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
 * @return {String} a formatted date
 *
 * @example {{ "2019-02-21" | formatDateRange }}
 * @example {{ ['2019-02-21'] | formatDateRange }}
 * @example {{ ["2019-02-21", "2019-02-28"] | formatDateRange }}
 * @example {{ "2019-02-21" | formatDateRange('DD/MM/YY') }}
 * @param value
 */
export function formatDateRangeAsRelativeWeek(value: string | string[]) {
  const dates = filter(value)

  if (!value || !Array.isArray(value) || dates.length === 0) {
    return value
  }

  if (dates.length === 1) {
    return formatDate(dates[0])
  }

  if (_isCurrentWeek(dates)) {
    return 'this week'
  }

  if (_isNextWeek(dates)) {
    return 'next week'
  }

  if (_isLastWeek(dates)) {
    return 'last week'
  }

  return formatDateRange(value)
}

export function formatISOWeek(dateRange: string | string[]) {
  if (!Array.isArray(dateRange) || dateRange.length !== 2) {
    return dateRange
  }

  const [startDate, endDate] = dateRange
  return startDate === endDate
    ? startDate
    : format(_parseDate(startDate), "yyyy-'W'II")
}

/**
 * Formats a date to the long date format including day
 *
 * @return {String} a formatted date with the day
 *
 * @example {{ "2019-02-21" | formatDateWithDay }}
 * @param value
 */
export function formatDateWithDay(value: string | Date) {
  return formatDate(value, DATE_FORMATS.WITH_DAY)
}

/**
 * Formats a date with date and time
 *
 * @return {String} a formatted date with the day
 *
 * @example {{ "2019-02-21" | formatDateWithTimeAndDay }}
 * @param value
 * @param includeSeconds
 */
export function formatDateWithTimeAndDay(
  value: string | Date,
  includeSeconds = false
) {
  const timeFormat = includeSeconds
    ? 'WITH_TIME_WITH_SECONDS_AND_DAY'
    : 'WITH_TIME_AND_DAY'
  return formatDate(value, DATE_FORMATS[timeFormat])
}

/**
 * Formats a time for an event
 *
 * @return {String} a formatted time as string
 * @example {{ "2000-01-01T14:00:00Z" | formatDateTimeForEvents }}
 * @param value
 */
export function formatDateTimeForEvents(value: string | Date) {
  return formatDate(value, DATE_FORMATS.WITH_TIME_AND_DAY_FOR_EVENTS)
}

/**
 * Returns today, tomorrow or yesterday if they match, otherwise
 * it will return that date formatted with day by default or in
 * the format supplied
 *
 * @return {String} a formatted date
 *
 * @example {{ "2019-02-21" | formatDateAsRelativeDay }}
 * @example {{ "2019-02-21" | formatDateAsRelativeDay('DD/MM/YYYY') }}
 * @param value
 * @param formattedDateStr
 */
export function formatDateAsRelativeDay(
  value: string | Date,
  formattedDateStr = DATE_FORMATS.WITH_DAY
) {
  const date = _parseDate(value)

  if (isToday(date)) {
    return 'today'
  }

  if (isTomorrow(date)) {
    return 'tomorrow'
  }

  if (isYesterday(date)) {
    return 'yesterday'
  }

  return formatDate(value, formattedDateStr)
}

/**
 * Returns current date formatted with day along with
 * today, tomorrow or yesterday in brackets if they match
 *
 *
 * @example {{ "2019-02-21" | formatDateWithRelativeDay }}
 * @param value
 */
export function formatDateWithRelativeDay(value: string | Date) {
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
 *
 * @example {{ ["2019-02-21", "2019-02-28"] | formatDateRangeWithRelativeWeek }}
 * @param value
 */
export function formatDateRangeWithRelativeWeek(value: string[]) {
  const dates = filter(value)

  if (!value || !Array.isArray(value) || dates.length === 0) {
    return value
  }

  if (dates.length === 1) {
    return formatDate(dates[0])
  }

  const dateWithWeek = formatDateRange(value)

  return _isCurrentWeek(dates) || _isNextWeek(dates) || _isLastWeek(dates)
    ? `${dateWithWeek} (${formatDateRangeAsRelativeWeek(value)})`
    : dateWithWeek
}

/**
 * Returns an age based on a date
 * @return {String} an age as a string
 * @example {{ "2000-02-21" | calculateAge }}
 * @param value
 */
export function calculateAge(value: string | Date) {
  const parsedDate = _parseDate(value)

  if (!isValidDate(parsedDate)) {
    return value
  }

  return differenceInYears(new Date(), parsedDate)
}

/**
 * Formats a time
 *
 * @return {String} a formatted time as string
 * @example {{ "2000-01-01T14:00:00Z" | formatTime }}
 * @param value
 */
export function formatTime(value: string | Date) {
  const parsedDate = _parseDate(value)

  if (!value || !isValidDate(parsedDate)) {
    return value
  }

  return format(parsedDate, 'HH:mm')
}

/**
 * Join a list of items using commas and `and` as
 * the final join
 *
 * @return {String} items joined using commas and the last delimiter
 * @example {{ ["one","two","three"] | oxfordJoin }}
 * @param arr
 * @param lastDelimiter
 */
export function oxfordJoin(arr: string[] = [], lastDelimiter = 'and') {
  if (!arr || !Array.isArray(arr)) {
    return arr
  } else if (arr.length === 1) {
    return arr[0]
  } else if (arr.length === 2) {
    // joins all with "and" but no commas
    return arr.join(` ${lastDelimiter} `)
  }

  return arr.join(', ').replace(/, ([^,]*)$/, `, ${lastDelimiter} $1`)
}

/**
 * Join a list of items using commas and `and` as
 * the final join
 *
 * @return {String} items joined using commas and the last delimiter
 * @example {{ ["one","two","three"] | nonOxfordJoin }}
 * @param arr
 * @param lastDelimiter
 */
export function nonOxfordJoin(arr: string[] = [], lastDelimiter = 'and') {
  if (!arr || !Array.isArray(arr)) {
    return arr
  } else if (arr.length === 1) {
    return arr[0]
  } else if (arr.length === 2) {
    // joins all with "and" but no commas
    return arr.join(` ${lastDelimiter} `)
  }

  return arr.join(', ').replace(/, ([^,]*)$/, ` ${lastDelimiter} $1`)
}

export function filesize(str: string) {
  return filesizejs(str, {
    round: 0,
  })
}

export function containsElement(array: any[] = [], element: any) {
  return array.some(e => e.error === element)
}

export const { date, mojDate } = mojFilters
