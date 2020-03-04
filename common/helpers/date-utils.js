const {
  format,
  addDays,
  subDays,
  parseISO,
  startOfWeek,
  endOfWeek,
  isValid: isValidDate,
} = require('date-fns')

const dateFormat = 'yyyy-MM-dd'
const weekStartsOn = 1

module.exports = {
  dateFormat,
  getPeriod: (date, interval) => {
    const method = interval >= 0 ? addDays : subDays
    return format(method(parseISO(date), Math.abs(interval)), dateFormat)
  },
  getDateFromParams: req => {
    const date = req.params.date
    const parsedDate = parseISO(date)
    const validDate = isValidDate(parsedDate)

    if (!validDate) {
      return null
    }
    return format(parsedDate, dateFormat)
  },
  getDateRange: (period, date) => {
    let startDate
    let endDate
    if (period === 'week') {
      startDate = startOfWeek(parseISO(date), { weekStartsOn })
      endDate = endOfWeek(parseISO(date), { weekStartsOn })
    } else {
      startDate = parseISO(date)
      endDate = startDate
    }
    return [format(startDate, dateFormat), format(endDate, dateFormat)]
  },
}
