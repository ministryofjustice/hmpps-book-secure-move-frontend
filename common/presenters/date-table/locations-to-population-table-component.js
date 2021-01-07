const { parseISO, isValid, isDate, addDays } = require('date-fns')
const { times, keys } = require('lodash')

const tablePresenters = require('../table')

const {
  dayConfig,
  establishmentConfig,
  headerRowConfig,
} = require('./population-helpers')

/*
const {
freeSpaceHeadConfig,
freeSpaceRowConfig,

transfersInHeadConfig
transfersInRowConfig

transfersOutHeadConfig
transfersOutRowConfig


headBuilder
rowBuilder

weekltViwq: {
  headBuilder({html: 'population::labels.lastablishment}),
  rowBuilder({html: (data) => {})

  headBuilder({text: "Day pop+1})
  rowBuilder(html: (data) => cellBuilder(variables)
  }
 */
function locationsToPopulationAndTransfersTables({
  query,
  startDate,
  dayCount = 5,
} = {}) {
  let startDateAsDate = isDate(startDate) ? startDate : parseISO(startDate)

  if (!isValid(startDateAsDate)) {
    startDateAsDate = new Date()
  }

  const tableConfig = cellType =>
    times(dayCount, index => {
      return dayConfig({
        cellType: cellType,
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

  // tableConfig.unshift({
  //   head: {
  //     text: '',
  //     attributes: {
  //       width: '220',
  //     },
  //   },
  // })
  //
  // const emptyHeader = {
  //   head: {
  //     html: '',
  //     attributes: {
  //       width: '220',
  //     },
  //   },
  // }
  //
  // populationConfig.unshift(emptyHeader)
  // transfersInConfig.unshift(emptyHeader)
  // transfersOutConfig.unshift(emptyHeader)

  // console.log(JSON.stringify(populationConfig, null, 2))

  return function (locations) {
    const locationKeys = keys(locations).sort()

    const groupedLocations = locationKeys.map(groupedLocation => {
      return {
        caption: groupedLocation,
        captionClasses: 'govuk-heading-m',
        classes: 'population-table',
        head: populationConfig.map(tablePresenters.objectToTableHead(query)),
        rows: locations[groupedLocation].reduce((acc, value) => {
          acc.push(tablePresenters.objectToTableRow(populationConfig)(value))
          acc.push(tablePresenters.objectToTableRow(transfersInConfig)(value))
          acc.push(tablePresenters.objectToTableRow(transfersOutConfig)(value))
          return acc
        }, []),
      }
    })

    return groupedLocations
  }

  // return function (locations = []) {
  //   return {
  //     head: populationConfig.map(tablePresenters.objectToTableHead(query)),
  //     oldRows: locations.map(tablePresenters.objectToTableRow(tableConfig)),
  //     rows: locations.reduce((acc, value) => {
  //       acc.push(tablePresenters.objectToTableRow(populationConfig)(value))
  //       acc.push(tablePresenters.objectToTableRow(transfersInConfig)(value))
  //       acc.push(tablePresenters.objectToTableRow(transfersOutConfig)(value))
  //       return acc
  //     }, []),
  //   }
  // }
}

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

  tableConfig.unshift(establishmentConfig({ date: startDateAsDate }))

  return function (locations) {
    const locationKeys = keys(locations).sort()

    const groupedLocations = locationKeys.map(groupedLocation => {
      return {
        caption: groupedLocation,
        captionClasses: 'govuk-heading-m',
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
