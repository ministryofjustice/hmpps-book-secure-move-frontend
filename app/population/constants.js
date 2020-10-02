const { dateRegex, uuidRegex } = require('../../common/helpers/url')

const MOUNTPATH = '/population'

// const ACTIONS = [
//   {
//     permission: 'allocation:create',
//     text: 'actions::create_allocation',
//     href: '/allocation/new',
//   },
// ]

const BASE_PATH = `/:period(week|day)/:date(${dateRegex})`
const VIEW_PATH = `/:period(week|day)/:date(${dateRegex})/:locationId(${uuidRegex})`

const FREESPACE_PATH = '/freespace'
const TRANSFERS_PATH = '/transfers'

// dashboard: /population/week/2020-09-29 - grid of all locations and spaces

// view: /population/week/2020-09-29/{uuid} - grid of free spaces and transfers in and out
// freespace: /population/day/2020-09-29/{uuid}/freespaces - free space editing wizard
// transfers: /population/day/2020-09-29/{uuid}/transfers

const DEFAULTS = {
  QUERY: {
    population: { status: '', sortBy: 'date', sortDirection: 'asc' },
  },
  TIME_PERIOD: {
    population: 'week',
  },
}

// const FILTERS = {
//   outgoing: [
//     {
//       label: 'allocations::total',
//       status: '',
//     },
//     {
//       label: 'statuses::filled',
//       status: 'filled',
//     },
//     {
//       label: 'statuses::unfilled',
//       status: 'unfilled',
//     },
//   ],
// }

module.exports = {
  // ACTIONS,
  BASE_PATH,
  VIEW_PATH,
  FREESPACE_PATH,
  TRANSFERS_PATH,
  DEFAULTS,
  // FILTERS,
  MOUNTPATH,
}
