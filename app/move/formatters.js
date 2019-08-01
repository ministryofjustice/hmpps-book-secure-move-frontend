const chrono = require('chrono-node')
const { format: formatDate } = require('date-fns')

const formatters = {
  date(value, format = 'YYYY-MM-DD') {
    const parsedDate = chrono.en_GB.parseDate(value)
    return parsedDate ? formatDate(parsedDate, format) : value
  },
}

module.exports = formatters
