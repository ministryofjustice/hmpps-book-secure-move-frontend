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
      html: genericValueCellContent({
        cellType,
        date,
        populationIndex,
      }),
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
  content: ({ population }) => {
    if (isNil(population?.free_spaces) || population?.free_spaces === 0) {
      return i18n.t('population::add_space')
    }

    return i18n.t('population::spaces_with_count', {
      count: population.free_spaces,
    })
  },
}

const transfersInCellData = {
  url: ({ population, date, locationId }) => {
    return isNil(population?.transfers_in) || population.transfers_in === 0
      ? ''
      : `/population/day/${format(
          date,
          'yyyy-MM-dd'
        )}/${locationId}/transfersIn`
  },
  content: ({ population }) => {
    if (isNil(population?.transfers_in) || population.transfers_in === 0) {
      return i18n.t('population::no_transfers')
    }

    return i18n.t('population::transfers_in_with_count', {
      count: population.transfers_in,
    })
  },
}

const transfersOutCellData = {
  url: ({ population, date, locationId }) => {
    return isNil(population?.transfers_out) || population.transfers_out === 0
      ? ''
      : `/population/day/${format(
          date,
          'yyyy-MM-dd'
        )}/${locationId}/transfersOut`
  },
  content: ({ population }) => {
    if (isNil(population?.transfers_out) || population.transfers_out === 0) {
      return i18n.t('population::no_transfers')
    }

    return i18n.t('population::transfers_out_with_count', {
      count: population.transfers_out,
    })
  },
}

const RENDER_LOOKUP = {
  transfersIn: transfersInCellData,
  transfersOut: transfersOutCellData,
  freeSpaces: freeSpacesCellData,
}

const genericValueCellContent = function ({
  cellType,
  date,
  populationIndex = 0,
}) {
  const cellRenderer = RENDER_LOOKUP[cellType]

  if (!cellRenderer) {
    return () => ''
  }

  return data => {
    const { id: locationId } = data
    const population = data?.meta?.populations?.[populationIndex] || {}

    const content = cellRenderer.content({ population })

    const url = cellRenderer.url({ population, date, locationId })

    if (!url) {
      return `<span>${content}</span>`
    }

    return `<a href="${url}">${content}</a>`
  }
}

const headerRowConfig = function ({ title }) {
  return {
    head: {
      text: '',
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
  // freeSpaceCellContent,
  headerRowConfig,
  freeSpacesCellData,
  transfersInCellData,
  transfersOutCellData,
}
