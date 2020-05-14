const { setPagination } = require('./middleware')

const CONSTANTS = {
  DEFAULTS: {
    QUERY: {
      requested: { status: 'pending' },
      outgoing: {},
    },
    TIME_PERIOD: {
      requested: 'week',
      outgoing: 'day',
    },
  },
  COLLECTION_MIDDLEWARE: [setPagination],
}

module.exports = CONSTANTS
