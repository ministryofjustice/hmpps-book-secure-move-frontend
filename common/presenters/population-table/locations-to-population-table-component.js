const { parseISO, isValid } = require('date-fns')

const tablePresenters = require('../table')

const { dayConfig, establishmentConfig } = require('./population-table-config')

function locationsToPopulationTable({
  isSortable = false,
  query,
  focusDate,
  startDate,
} = {}) {
  if (!isValid(startDate)) {
    startDate = parseISO(startDate)
  }

  if (!isValid(startDate)) {
    startDate = new Date()
  }

  const tableConfig = [
    {
      ...establishmentConfig({}),
    },
    {
      ...dayConfig({
        focusDate: focusDate,
        baseDate: startDate,
        baseOffset: 0,
      }),
    },
    {
      ...dayConfig({
        focusDate: focusDate,
        baseDate: startDate,
        baseOffset: 1,
      }),
    },
    {
      ...dayConfig({
        focusDate: focusDate,
        baseDate: startDate,
        baseOffset: 2,
      }),
    },
    {
      ...dayConfig({
        focusDate: focusDate,
        baseDate: startDate,
        baseOffset: 3,
      }),
    },
    {
      ...dayConfig({
        focusDate: focusDate,
        baseDate: startDate,
        baseOffset: 4,
      }),
    },
  ]

  return function (locations = []) {
    return {
      head: tableConfig.map(tablePresenters.objectToTableHead(query)),
      rows: locations.map(tablePresenters.objectToTableRow(tableConfig)),
    }
  }
}

module.exports = locationsToPopulationTable
