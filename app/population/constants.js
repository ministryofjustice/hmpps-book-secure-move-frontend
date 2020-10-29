const { dateRegex } = require('../../common/helpers/url')

const MOUNTPATH = '/population'

const BASE_PATH = `/:period(week|day)/:date(${dateRegex})`

const DEFAULTS = {
  QUERY: {
    population: { status: '', sortBy: 'date', sortDirection: 'asc' },
  },
  TIME_PERIOD: {
    population: 'week',
  },
}

const FILTERS = {
  filterTypething: 'prison',
}

module.exports = {
  BASE_PATH,
  DEFAULTS,
  MOUNTPATH,
  FILTERS,
}
