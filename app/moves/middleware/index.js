const redirectBaseUrl = require('./redirect-base-url')
const saveUrl = require('./save-url')
const setDashboardMoveSummary = require('./set-dashboard-move-summary')
const setFilterSingleRequests = require('./set-filter.single-requests')
const setFromLocation = require('./set-from-location')
const setMovesByDateRangeAndStatus = require('./set-moves-by-date-range-and-status')
const setPagination = require('./set-pagination')
const setResultsOutgoing = require('./set-results.outgoing')

module.exports = {
  redirectBaseUrl,
  saveUrl,
  setDashboardMoveSummary,
  setFromLocation,
  setMovesByDateRangeAndStatus,
  setFilterSingleRequests,
  setResultsOutgoing,
  setPagination,
}
