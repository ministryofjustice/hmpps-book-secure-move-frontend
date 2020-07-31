const chrono = require('chrono-node')

const dateRegex = /^(\d{1,2})([/-])(\d{1,2})([/-](\d{1,4})){0,1}$/

// chrono-node removed the en_GB object in v2
// this ensures that dates are in the US/international en format before parsing them
// dd/MM/yyyy -> MM/dd/yyyy
// eg. 10/3/2019 -> 3/10/2019
// dd/MM -> MM/dd
// eg. 10/3 -> 3/10
// dd-MM-yyyy -> MM/dd/yyyy
// eg. 10-3-2019 -> 3/10/2019
// dd-MM -> MM/dd
// eg. 10-3 -> 3/10
const getInternationalValue = value => {
  return value.trim().replace(dateRegex, (m, m1, m2, m3, m4, m5, m6) => {
    let rejiggedDate = `${m3}/${m1}`

    if (m5) {
      if (m5.length !== 4) {
        return 'invalid'
      }

      rejiggedDate += `/${m5}`
    }

    return rejiggedDate
  })
}

const parsers = {
  date(value) {
    if (!value || typeof value !== 'string') {
      return value
    }

    const internationalValue = getInternationalValue(value)
    return chrono.en.parseDate(internationalValue)
  },
}

module.exports = parsers
