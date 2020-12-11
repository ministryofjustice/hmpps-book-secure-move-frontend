const { parseISO, isValid, isDate, addDays, format } = require('date-fns')
const { times } = require('lodash')

const i18n = require('../../../config/i18n')
const tablePresenters = require('../table')

const freeSpaceCellContent = function ({ date, populationIndex = 0 }) {
  return data => {
    const { id: locationId } = data
    const { free_spaces: count } =
      data?.meta?.populations?.[populationIndex] || {}

    const link =
      count === undefined
        ? i18n.t('population::add_space')
        : i18n.t('population::spaces_with_count', { count })

    const editQuicklink = count === undefined ? '/edit' : ''

    const url = `/population/day/${format(
      date,
      'yyyy-MM-dd'
    )}/${locationId}${editQuicklink}`

    return `<a href="${url}">${link}</a>`
  }
}

const dayConfig = function ({ date, populationIndex = 0 }) {
  return {
    head: {
      date,
      attributes: {
        width: '80',
      },
      text: `Day ${populationIndex + 1}`,
    },
    row: {
      date,
      html: data => freeSpaceCellContent({ date, populationIndex })(data),
    },
  }
}

const establishmentConfig = {
  head: {
    html: 'population::labels.establishment',
    attributes: {
      width: '220',
    },
  },
  row: {
    attributes: {
      scope: 'row',
    },
    html: data => {
      return `<a>${data.title}</a>`
    },
  },
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

  tableConfig.unshift(establishmentConfig)

  return function (locations = []) {
    return {
      head: tableConfig.map(tablePresenters.objectToTableHead(query)),
      rows: locations.map(tablePresenters.objectToTableRow(tableConfig)),
    }
  }
}

module.exports = {
  locationsToPopulationTable,
  freeSpaceCellContent,
  dayConfig,
}
