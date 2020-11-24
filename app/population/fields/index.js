const bedwatch = require('./bedwatch')
const discharges = require('./discharges')
const operationalCapacity = require('./operational-capacity')
const outOfAreaCourts = require('./out-of-area-courts')
const overnightsIn = require('./overnights-in')
const overnightsOut = require('./overnights-out')
const unlock = require('./unlock')
const usableCapacity = require('./usable-capacity')

const editFields = {
  bedwatch,
  discharges,
  operational_capacity: operationalCapacity,
  out_of_area_courts: outOfAreaCourts,
  overnights_in: overnightsIn,
  overnights_out: overnightsOut,
  unlock,
  usable_capacity: usableCapacity,
}

module.exports = {
  editFields,
}
