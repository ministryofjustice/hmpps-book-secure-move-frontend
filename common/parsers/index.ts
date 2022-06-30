import * as chrono from 'chrono-node'

const dateRegex = /^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{1,4}))?$/

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
const getInternationalValue = (value: string): string => {
  return value.trim().replace(dateRegex, (_, day, month, year) => {
    let rejiggedDate = `${month}/${day}`

    if (year) {
      if (year.length !== 4) {
        return 'invalid'
      }

      rejiggedDate += `/${year}`
    }

    return rejiggedDate
  })
}

export function date (value?: Date | string): Date | undefined {
  if (value instanceof Date) {
    return value
  } else if (!value || typeof value !== 'string') {
    return undefined
  }

  const internationalValue = getInternationalValue(value)
  return chrono.en.parseDate(internationalValue)
}
