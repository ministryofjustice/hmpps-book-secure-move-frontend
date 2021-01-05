const {
  establishmentCellData,
  freeSpacesCellData,
  transfersInCellData,
  transfersOutCellData,
} = require('./cell-renderers')

const RENDER_LOOKUP = {
  establishment: establishmentCellData,
  transfersIn: transfersInCellData,
  transfersOut: transfersOutCellData,
  freeSpaces: freeSpacesCellData,
}

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
      html: genericValueCellContent({
        cellType: 'establishment',
        date,
      }),
    },
  }
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

    const content = cellRenderer.content({ population, data })

    const url = cellRenderer.url({ population, date, locationId, data })

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
  headerRowConfig,
  genericValueCellContent,
}
