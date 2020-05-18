const { setPagination } = require('../moves/middleware')

const uuidRegex =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
const dateRegex = '[0-9]{4}-[0-9]{2}-[0-9]{2}'

const MOUNTPATH = '/allocations'
const COLLECTION_BASE_PATH = `/:period(week|day)/:date(${dateRegex})/:locationId(${uuidRegex})?`
const COLLECTION_VIEW_PATH = '/:view(outgoing)'
const COLLECTION_MIDDLEWARE = [
  setPagination(MOUNTPATH + COLLECTION_BASE_PATH + COLLECTION_VIEW_PATH),
]
const DEFAULTS = {
  QUERY: {
    outgoing: { status: '' },
  },
  TIME_PERIOD: {
    outgoing: 'week',
  },
}
const FILTERS = {
  outgoing: [
    {
      label: 'in_total',
      status: '',
    },
  ],
}

module.exports = {
  COLLECTION_BASE_PATH,
  COLLECTION_MIDDLEWARE,
  COLLECTION_VIEW_PATH,
  DEFAULTS,
  FILTERS,
  MOUNTPATH,
}
