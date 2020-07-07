const { format: formatDate } = require('date-fns')

const parse = require('../parsers')

const formatters = {
  date(value, format = 'yyyy-MM-dd') {
    const parsedDate = parse.date(value)
    return parsedDate ? formatDate(parsedDate, format) : value
  },
  time(value, format = 'HH:mm') {
    const parsedDate = parse.date(value)
    return parsedDate ? formatDate(parsedDate, format) : value
  },
}

module.exports = formatters
