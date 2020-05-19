const { dateRegex, uuidRegex } = require('../../common/helpers/url')

const MOUNTPATH = '/allocations'

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
  COLLECTION_PATH,
  DEFAULTS,
  FILTERS,
  MOUNTPATH,
}
