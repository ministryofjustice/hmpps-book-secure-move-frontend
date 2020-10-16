const convertHrtime = require('convert-hrtime')

const mapUnit = {
  s: 'seconds',
  ms: 'milliseconds',
  ns: 'nanoseconds',
}

const hrTimer = () => {
  const startTime = process.hrtime()

  return (unit = 'seconds') => {
    unit = mapUnit[unit] || unit
    const endTime = process.hrtime(startTime)
    return convertHrtime(endTime)[unit]
  }
}

const unitRatio = {
  seconds: 1 / 1000,
  milliseconds: 1,
  nanoseconds: 1000000,
}

const dateTimer = () => {
  const startTime = new Date()

  return (unit = 'seconds') => {
    unit = mapUnit[unit] || unit
    const endTime = new Date()
    const elapsed = endTime - startTime
    return elapsed * unitRatio[unit]
  }
}

/**
 * Timer function
 *
 * const myTimer = timer()
 * const elapsed = myTimer()
 *
 * @param {boolean} [hr]
 * Whether to use high or normal resolution
 *
 * @returns {function} Timer function that when called returns time elapsed
 *
 * By default timer function returns seconds, but can be called with milli or nanoseconds
 *
 * Abbreviations s, ms and ns
 *
 * Timer can be called as many times as required
 */
const getTimer = hr => (hr ? hrTimer() : dateTimer())

module.exports = getTimer
