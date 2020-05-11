const redirectBaseUrl = require('./redirect-base-url')
const saveUrl = require('./save-url')
const setDashboardMoveSummary = require('./set-dashboard-move-summary')
const setFilterSingleRequests = require('./set-filter.single-requests')
const setFromLocation = require('./set-from-location')
const setPagination = require('./set-pagination')
const setResultsOutgoing = require('./set-results.outgoing')
const setResultsSingleRequests = require('./set-results.single-requests')

module.exports = {
  redirectBaseUrl,
  saveUrl,
  setDashboardMoveSummary,
  setFromLocation,
  setFilterSingleRequests,
  setResultsOutgoing,
  setResultsSingleRequests,
  setPagination,
}
