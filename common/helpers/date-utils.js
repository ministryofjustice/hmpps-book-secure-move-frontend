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
  dateFormat: DATE_FORMATS.URL_PARAM,
  getPeriod: (date, interval) => {
    const method = interval >= 0 ? addDays : subDays
    return format(
      method(parseISO(date), Math.abs(interval)),
      DATE_FORMATS.URL_PARAM
    )
  },
  getDateFromParams: req => {
    const date = req.params.date
    const parsedDate = parseISO(date)
    const validDate = isValidDate(parsedDate)

    if (!validDate) {
      return null
    }
    return format(parsedDate, DATE_FORMATS.URL_PARAM)
  },
  getDateRange: (date, timePeriod) => {
    const parsedDate = isDate(date) ? date : parseISO(date)

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
