const filters = require('../nunjucks/filters')

const exists = value => value !== undefined && value !== ''

const formatters = {
  ...filters,
  exists,
}

const interpolation = {
  format: (value, format, lng) => {
    let output = value

    if (formatters[format]) {
      output = formatters[format](value)
    }

    return output
  },
}

module.exports = interpolation
