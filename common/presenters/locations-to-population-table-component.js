const { isNil } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const moveToCardComponent = require('./move-to-card-component')
const tablePresenters = require('./table')

const spacesFormatter = function (count) {
  if (count === 0) {
    return 'Add'
  }
  if (count === 1) {
    return '1 space'
  } else {
    return `${count} spaces`
  }
}

function locationsToPopulationTable({ isSortable = true, query } = {}) {
  const tableConfig = [
    {
      head: {
        isSortable,
        sortKey: 'title',
        html: 'title',
        attributes: {
          width: '220',
        },
      },
      row: {
        attributes: {
          scope: 'row',
        },
        html: data => {
          // const count = data.moves.length
          return `<a href="/population/week/2020-09-29/${data.id}">${data.title}</a>`
        },
      },
    },
    {
      head: {
        text: 'Mon 10',
        attributes: {
          width: '80',
        },
      },
      row: {
        html: data => {
          // const count = data.moves.length
          return `<a href="/population/day/2020-09-29/${
            data.id
          }/freespace">${spacesFormatter(data.meta[0])}</a>`
        },
      },
    },
    {
      head: {
        text: 'Tue 11',
        attributes: {
          width: '80',
        },
      },
      row: {
        html: data => {
          // const count = data.moves.length
          return `<a href="/population/day/2020-09-30/${
            data.id
          }/freespace">${spacesFormatter(data.meta[1])}</a>`
        },
      },
    },
    {
      head: {
        text: 'Wed 12',
        attributes: {
          width: '80',
        },
      },
      row: {
        html: data => {
          // const count = data.moves.length
          return `<a href="/population/day/2020-10-01/${
            data.id
          }/freespace">${spacesFormatter(data.meta[2])}</a>`
        },
      },
    },
    {
      head: {
        text: 'Thu 13',
        attributes: {
          width: '80',
        },
      },
      row: {
        html: data => {
          // const count = data.moves.length
          return `<a href="/population/day/2020-10-02/${
            data.id
          }/freespace">${spacesFormatter(data.meta[3])}</a>`
        },
      },
    },
    {
      head: {
        text: 'Fri 14',
        attributes: {
          width: '80',
        },
      },
      row: {
        html: data => {
          // const count = data.moves.length
          return `<a href="/population/day/2020-10-03/${
            data.id
          }/freespace">${spacesFormatter(data.meta[4])}</a>`
        },
      },
    },
  ]

  return function (locations = []) {
    return {
      // caption: 'Category C',
      head: tableConfig.map(tablePresenters.objectToTableHead(query)),
      rows: locations.map(tablePresenters.objectToTableRow(tableConfig)),
    }
  }
}

module.exports = locationsToPopulationTable
