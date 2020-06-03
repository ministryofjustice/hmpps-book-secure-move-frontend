const { dateRegex, uuidRegex } = require('../../common/helpers/url')

const MOUNTPATH = '/allocations'

const ACTIONS = [
  {
    href: '/allocation/new',
    permission: 'allocation:create',
    text: 'actions::create_allocation',
  },
]

const COLLECTION_PATH = `/:period(week|day)/:date(${dateRegex})/:locationId(${uuidRegex})?/:view(outgoing)`

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
      label: 'allocations::total',
      status: '',
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
