const MOUNTPATH = '/allocations'

const ACTIONS = [
  {
    permission: 'allocation:create',
    text: 'actions::create_an_allocation',
    href: '/allocation/new',
  },
]

const COLLECTION_PATH = `/:period/:date/{:locationId/}outgoing`

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
  DEFAULTS,
  FILTERS,
  MOUNTPATH,
}
