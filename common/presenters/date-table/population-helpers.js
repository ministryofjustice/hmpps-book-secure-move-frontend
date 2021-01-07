const { format } = require('date-fns')
const { isNil } = require('lodash')

const i18n = require('../../../config/i18n')

const dayConfig = function ({ cellType, date, populationIndex = 0 }) {
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
      // html: data =>
      // genericValueCellContent({ cellType, date, populationIndex })(data),
      html: data => freeSpaceCellContent({ date, populationIndex })(data),
      // htmlNw: data =>
      //   cellBuilder({ date, populationIndex, cellType: freeSpace })(data),
    },
  }
}

const establishmentConfig = function ({ date }) {
  return {
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
        return `<a href="/population/week/${format(date, 'yyyy-MM-dd')}/${
          data.id
        }">${data.title}</a>`
      },
    },
  }
}

const freeSpacesCellData = {
  url: ({ population, date, locationId }) =>
    `/population/day/${format(date, 'yyyy-MM-dd')}/${locationId}${
      isNil(population?.free_spaces) ? '/edit' : ''
    }`,
  html: ({ population }) => {
    return isNil(population?.free_spaces)
      ? i18n.t('population::add_space')
      : i18n.t('population::spaces_with_count', {
          count: population.free_spaces,
        })
  },
}

const transfersInCellData = {
  url: ({ population, date, locationId }) =>
    `/population/day/${format(date, 'yyyy-MM-dd')}/${locationId}/transfersOut`,
  html: ({ population }) =>
    isNil(population?.transfers_in)
      ? i18n.t('population::no_transfers')
      : i18n.t('population::transfers_in_with_count', {
          count: population.transfers_in,
        }),
}

const transfersOutCellData = {
  url: ({ population, date, locationId }) =>
    `/population/day/${format(date, 'yyyy-MM-dd')}/${locationId}/transfersOut`,
  html: ({ population }) =>
    isNil(population?.transfers_out)
      ? i18n.t('population::no_transfers')
      : i18n.t('population::transfers_out_with_count', {
          count: population.transfers_out,
        }),
}

const renderLookup = {
  transfersIn: transfersInCellData,
  transfersOut: transfersOutCellData,
  freeSpaces: freeSpacesCellData,
}
const genericValueCellContent = function ({
  cellType,
  date,
  populationIndex = 0,
}) {
  const cellRenderer = renderLookup[cellType]

  console.log(cellRenderer)
  return data => {
    const { id: locationId } = data
    const population = data?.meta?.populations?.[populationIndex] || {}

    // console.log(population)

    const url = cellRenderer.url({ population, date, locationId })
    const content = cellRenderer.html({ population })

    return `<a href="${url}">${content}</a>`
  }
}

const freeSpaceCellContent = function ({ date, populationIndex = 0 }) {
  return data => {
    const { id: locationId } = data
    const { free_spaces: freeSpaces } =
      data?.meta?.populations?.[populationIndex] || {}

    const hasNoFreeSpaces = isNil(freeSpaces)
    const link = hasNoFreeSpaces
      ? i18n.t('population::add_space')
      : i18n.t('population::spaces_with_count', { count: freeSpaces })

    const editQuicklink = hasNoFreeSpaces ? '/edit' : ''

    const url = `/population/day/${format(
      date,
      'yyyy-MM-dd'
    )}/${locationId}${editQuicklink}`

    return `<a href="${url}">${link}</a>`
  }
}

// const transferCellContent = function ({ date, populationIndex = 0 }) {
//   return data => {
//     // const { id: locationId } = data
//     // const { free_spaces: count } =
//     //   data?.meta?.populations?.[populationIndex] || {}
//     //
//     // const link =
//     //   count === undefined
//     //     ? i18n.t('population::add_space')
//     //     : i18n.t('population::spaces_with_count', { count })
//     //
//     // const editQuicklink = count === undefined ? '/edit' : ''
//     //
//     // const url = `/population/day/${format(
//     //   date,
//     //   'yyyy-MM-dd'
//     // )}/${locationId}${editQuicklink}`
//
//     return 'None booked'
//   }
// }

const headerRowConfig = function ({ title }) {
  return {
    head: {
      text: '-',
      attributes: {
        width: '220',
      },
    },
    row: {
      attributes: {
        scope: 'row',
      },
      html: () => `<b>${title}</b>`,
    },
  }
}

module.exports = {
  dayConfig,
  establishmentConfig,
  freeSpaceCellContent,
  headerRowConfig,
}
