const { dateRegex, uuidRegex } = require('../../common/helpers/url')
const { setPagination } = require('../../common/middleware/collection')

const MOUNTPATH = '/moves'
const COLLECTION_BASE_PATH = `/:period(week|day)/:date(${dateRegex})/:locationId(${uuidRegex})?`
const COLLECTION_VIEW_PATH = '/:view(outgoing|requested)'
const COLLECTION_MIDDLEWARE = [
  setPagination(MOUNTPATH + COLLECTION_BASE_PATH + COLLECTION_VIEW_PATH),
]
const DEFAULTS = {
  QUERY: {
    requested: { status: 'pending' },
    outgoing: {},
  },
  TIME_PERIOD: {
    requested: 'week',
    outgoing: 'day',
  },
}
const FILTERS = {
  requested: [
    {
      label: 'statuses::pending',
      status: 'pending',
    },
    {
      label: 'statuses::approved',
      status: 'approved',
    },
    {
      label: 'statuses::rejected',
      status: 'rejected',
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
