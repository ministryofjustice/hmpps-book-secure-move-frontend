const { parseISO, isValid, isDate, addDays } = require('date-fns')
const { times, keys } = require('lodash')

const tablePresenters = require('../table')

const { dayConfig, establishmentConfig } = require('./population-helpers')

function locationsToPopulationTable({ query, startDate, dayCount = 5 } = {}) {
  let startDateAsDate = isDate(startDate) ? startDate : parseISO(startDate)

  if (!isValid(startDateAsDate)) {
    startDateAsDate = new Date()
  }

  const tableConfig = times(dayCount, index => {
    return dayConfig({
      date: addDays(startDateAsDate, index),
      populationIndex: index,
    })
  })

  tableConfig.unshift(establishmentConfig)

  return function (locations) {
    const locationKeys = keys(locations).sort()

    const groupedLocations = locationKeys.map(groupedLocation => {
      return {
        caption: groupedLocation,
        head: tableConfig.map(tablePresenters.objectToTableHead(query)),
        rows: locations[groupedLocation].map(
          tablePresenters.objectToTableRow(tableConfig)
        ),
      }
    })

    return groupedLocations
  }
}

module.exports = {
  locationsToPopulationTable,
}
