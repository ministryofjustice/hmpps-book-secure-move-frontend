const { parseISO, isValid } = require('date-fns')
const { times } = require('lodash')

const tablePresenters = require('../table')

const { dayConfig, establishmentConfig } = require('./population-table-config')

function locationsToPopulationTable({
  isSortable = false,
  query,
  focusDate,
  startDate,
  dayCount = 5,
} = {}) {
  if (!isValid(startDate)) {
    startDate = parseISO(startDate)
  }

  if (!isValid(startDate)) {
    startDate = new Date()
  }

  const tableConfig = times(dayCount, index => {
    return dayConfig({
      focusDate: focusDate,
      baseDate: startDate,
      baseOffset: index,
    })
  })

  tableConfig.unshift(establishmentConfig({}))

  return function (locations = []) {
    return {
      head: tableConfig.map(tablePresenters.objectToTableHead(query)),
      rows: locations.map(tablePresenters.objectToTableRow(tableConfig)),
    }
  }
}

module.exports = locationsToPopulationTable
