const { parseISO, isValid, isDate, addDays } = require('date-fns')
const { times, keys } = require('lodash')

const tablePresenters = require('../table')

const {
  dayConfig,
  establishmentConfig,
  headerRowConfig,
} = require('./population-helpers')

function locationsToPopulationAndTransfersTables({
  query,
  startDate,
  dayCount = 5,
  includeTransfers = true,
} = {}) {
  let startDateAsDate = isDate(startDate) ? startDate : parseISO(startDate)

  if (!isValid(startDateAsDate)) {
    startDateAsDate = new Date()
  }

  const tableConfig = cellType =>
    times(dayCount, index => {
      return dayConfig({
        cellType,
        date: addDays(startDateAsDate, index),
        populationIndex: index,
      })
    })

  const populationConfig = [headerRowConfig({ title: 'Free spaces' })].concat(
    tableConfig('freeSpaces')
  )
  const transfersInConfig = [headerRowConfig({ title: 'Transfers in' })].concat(
    tableConfig('transfersIn')
  )
  const transfersOutConfig = [
    headerRowConfig({ title: 'Transfers out' }),
  ].concat(tableConfig('transfersOut'))

  return function (locations) {
    const locationKeys = keys(locations).sort()

    const groupedLocations = locationKeys.map(groupedLocation => {
      return {
        caption: groupedLocation,
        captionClasses: 'govuk-table__caption--m',
        firstCellIsHeader: true,
        classes: 'population-table',
        head: populationConfig.map(tablePresenters.objectToTableHead(query)),
        rows: locations[groupedLocation].reduce((acc, value) => {
          acc.push(tablePresenters.objectToTableRow(populationConfig)(value))

          if (includeTransfers) {
            acc.push(tablePresenters.objectToTableRow(transfersInConfig)(value))
            acc.push(
              tablePresenters.objectToTableRow(transfersOutConfig)(value)
            )
          }

          return acc
        }, []),
      }
    })

    return groupedLocations
  }
}

function locationsToPopulationTable({ query, startDate, dayCount = 5 } = {}) {
  let startDateAsDate = startDate
    ? isDate(startDate)
      ? startDate
      : parseISO(startDate)
    : new Date()

  if (!isValid(startDateAsDate)) {
    startDateAsDate = new Date()
  }

  const tableConfig = times(dayCount, index => {
    return dayConfig({
      cellType: 'freeSpaces',
      date: addDays(startDateAsDate, index),
      populationIndex: index,
    })
  })

  tableConfig.unshift(establishmentConfig({ date: startDateAsDate }))

  return function (locations) {
    const locationKeys = keys(locations).sort()

    const groupedLocations = locationKeys.map(groupedLocation => {
      return {
        caption: groupedLocation,
        captionClasses: 'govuk-table__caption--m',
        firstCellIsHeader: true,
        classes: 'population-table',
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
  locationsToPopulationAndTransfersTables,
  locationsToPopulationTable,
}
