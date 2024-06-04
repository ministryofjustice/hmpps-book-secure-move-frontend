const {
  format,
  addDays,
  subDays,
  parseISO,
  startOfWeek,
  endOfWeek,
  isValid: isValidDate,
  isDate,
} = require('date-fns')

const { DATE_FORMATS } = require('../../config/index')

module.exports = {
  getCurrentWeekAsRange: () => {
    const today = new Date()
    const startDate = format(
      startOfWeek(today, {
        weekStartsOn: DATE_FORMATS.WEEK_STARTS_ON,
      }),
      DATE_FORMATS.URL_PARAM
    )
    const endDate = format(
      endOfWeek(today, {
        weekStartsOn: DATE_FORMATS.WEEK_STARTS_ON,
      }),
      DATE_FORMATS.URL_PARAM
    )

    return [startDate, endDate]
  },
  getCurrentDayAsRange: () => {
    const today = format(new Date(), DATE_FORMATS.URL_PARAM)

    return [today, today]
  },
  getRelativeDate: (date, interval) => {
    const method = interval >= 0 ? addDays : subDays

    return format(
      method(parseISO(date), Math.abs(interval)),
      DATE_FORMATS.URL_PARAM
    )
  },
  getDateRange: (date, timePeriod) => {
    const parsedDate = isDate(date)
      ? date
      : typeof date === 'string'
        ? parseISO(date)
        : null

    if (!isValidDate(parsedDate)) {
      return [undefined, undefined]
    }

    let dateFrom
    let dateTo

    switch (timePeriod) {
      case 'week':
        dateFrom = startOfWeek(parsedDate, {
          weekStartsOn: DATE_FORMATS.WEEK_STARTS_ON,
        })
        dateTo = endOfWeek(parsedDate, {
          weekStartsOn: DATE_FORMATS.WEEK_STARTS_ON,
        })
        break
      default:
        dateFrom = parsedDate
        dateTo = parsedDate
        break
    }

    return [
      format(dateFrom, DATE_FORMATS.URL_PARAM),
      format(dateTo, DATE_FORMATS.URL_PARAM),
    ]
  },
}
