const chrono = require('chrono-node')
const { format: formatDate } = require('date-fns')

const formatters = {
  date(value, format = 'yyyy-MM-dd') {
    const parsedDate = chrono.en_GB.parseDate(value)
    return parsedDate ? formatDate(parsedDate, format) : value
  },
  displayDate(value, format = 'd MMM yyyy') {
    return formatters.date(value, format)
  },
  time(value, format = 'HH:mm') {
    const parsedDate = chrono.en_GB.parseDate(value)
    return parsedDate ? formatDate(parsedDate, format) : value
  },
}

module.exports = formatters
