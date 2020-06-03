const { dateRegex, uuidRegex } = require('../../common/helpers/url')
const {
  setActions,
  setPagination,
} = require('../../common/middleware/collection')

const actions = [
  {
    href: '/move/new',
    permission: 'move:create',
    text: 'actions::create_move',
  },
]

const MOUNTPATH = '/moves'

const COLLECTION_BASE_PATH = `/:period(week|day)/:date(${dateRegex})/:locationId(${uuidRegex})?`

const COLLECTION_VIEW_PATH = '/:view(outgoing|requested)'

const COLLECTION_MIDDLEWARE = [
  setActions(actions),
  setPagination(MOUNTPATH + COLLECTION_BASE_PATH + COLLECTION_VIEW_PATH),
]

const DEFAULTS = {
  QUERY: {
    outgoing: {},
    requested: { status: 'pending' },
  },
  TIME_PERIOD: {
    outgoing: 'day',
    requested: 'week',
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
