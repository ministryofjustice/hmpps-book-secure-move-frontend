const chrono = require('chrono-node')

const parsers = {
  date(value) {
    if (!value || typeof value !== 'string') {
      return value
    }

    // chrono-node removed the en_GB object in v2
    // this ensures that dates are in the US/international en format before parsing them
    // dd/MM/yyyy -> MM/dd/yyyy
    // eg. 10/3/2019 -> 3/10/2019
    // dd/MM -> MM/dd
    // eg. 10/3 -> 3/10
    // dd-MM-yyyy -> MM-dd-yyyy
    // eg. 10-3-2019 -> 3-10-2019
    const internationalValue = value
      .trim()
      .replace(/^(\d{1,2})([/-])(\d{1,2})(([/-]\d{4}){0,1})$/, '$3$2$1$4')
    return chrono.en.parseDate(internationalValue)
  },
}

module.exports = parsers
