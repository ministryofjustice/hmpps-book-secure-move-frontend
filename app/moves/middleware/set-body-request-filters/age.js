const { format, sub } = require('date-fns')

const nineteen = { years: 19, months: 0 }
const seventeenEight = { years: 17, months: 8 }

const ranges = {
  under17: { from: seventeenEight },
  '17to19': { from: nineteen, to: seventeenEight },
  under19: { from: nineteen },
  over19: { to: nineteen },
}

const getDateOfBirth = duration => {
  if (!duration) {
    return
  }

  return format(sub(new Date(), duration), 'yyyy-MM-dd')
}

module.exports = age => {
  if (!age) {
    return {}
  }

  const dateOfBirthFrom = getDateOfBirth(ranges[age]?.from)
  const dateOfBirthTo = getDateOfBirth(ranges[age]?.to)

  return {
    dateOfBirthFrom,
    dateOfBirthTo,
  }
}
