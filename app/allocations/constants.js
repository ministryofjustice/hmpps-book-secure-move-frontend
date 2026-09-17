const { matchParam } = require('../../common/helpers/url')

const MOUNTPATH = '/allocations'

const ACTIONS = [
  {
    permission: 'allocation:create',
    text: 'actions::create_an_allocation',
    href: '/allocation/new',
  },
]

const COLLECTION_PATH = '/:period/:date{/:locationId}/:view'

// date and locationId are already validated by the setDateRange/setLocation
// router.param() handlers - only period and view have no existing validator.
const COLLECTION_PATH_GUARDS = [
  matchParam('period', ['week', 'day']),
  matchParam('view', ['outgoing']),
]

const DEFAULTS = {
  QUERY: {
    outgoing: {
      status: 'unfilled',
      sortBy: 'date',
      sortDirection: 'asc',
    },
  },
  TIME_PERIOD: {
    outgoing: 'week',
  },
}

const FILTERS = {
  outgoing: [
    {
      label: 'statuses::unfilled',
      status: 'unfilled',
    },
    {
      label: 'statuses::filled',
      status: 'filled',
    },
    {
      label: 'collections::cancelled_allocations',
      status: 'cancelled',
    },
  ],
}

module.exports = {
  ACTIONS,
  COLLECTION_PATH,
  COLLECTION_PATH_GUARDS,
  DEFAULTS,
  FILTERS,
  MOUNTPATH,
}
