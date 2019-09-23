const chrono = require('chrono-node')
const { format: formatDate } = require('date-fns')

const formatters = {
  date(value, format = 'yyyy-MM-dd') {
    const parsedDate = chrono.en_GB.parseDate(value)
    return parsedDate ? formatDate(parsedDate, format) : value
  },
}

module.exports = formatters
