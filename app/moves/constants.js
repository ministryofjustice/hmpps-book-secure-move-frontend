const { dateRegex, uuidRegex } = require('../../common/helpers/url')
const {
  setActions,
  setDatePagination,
} = require('../../common/middleware/collection')

const actions = [
  {
    permission: 'move:create',
    text: 'actions::create_move',
    href: '/move/new',
  },
]

const MOUNTPATH = '/moves'

const COLLECTION_BASE_PATH = `/:period(week|day)/:date(${dateRegex})/:locationId(${uuidRegex})?`

const COLLECTION_VIEW_PATH = '/:view(outgoing|incoming|requested)'

const COLLECTION_MIDDLEWARE = [
  setActions(actions),
  setDatePagination(MOUNTPATH + COLLECTION_BASE_PATH + COLLECTION_VIEW_PATH),
]

const DEFAULTS = {
  QUERY: {
    requested: { status: 'pending' },
    outgoing: { status: 'active', group_by: 'location' },
    incoming: { status: 'active', group_by: 'location' },
  },
  TIME_PERIOD: {
    requested: 'week',
    outgoing: 'day',
    incoming: 'day',
  },
}

const FILTERS = {
  outgoing: [
    {
      label: 'dashboard::sections.outgoing.summary.total',
      status: 'active',
    },
    {
      label: 'statuses::incomplete',
      status: 'incomplete',
    },
    {
      label: 'statuses::ready_for_transit',
      status: 'ready_for_transit',
    },
    {
      label: 'statuses::left_custody',
      status: 'left_custody',
    },
    {
      label: 'statuses::cancelled_filter',
      status: 'cancelled',
    },
  ],
  incoming: [
    {
      label: 'dashboard::sections.incoming.summary.total',
      status: 'active',
    },
    {
      label: 'statuses::awaiting_collection',
      status: 'awaiting_collection',
    },
    {
      label: 'statuses::in_transit_filter',
      status: 'in_transit',
    },
    {
      label: 'statuses::arrived',
      status: 'completed',
    },
    {
      label: 'statuses::cancelled_filter',
      status: 'cancelled',
    },
  ],
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
    {
      label: 'statuses::cancelled_filter',
      status: 'cancelled',
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
