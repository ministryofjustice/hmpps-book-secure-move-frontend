const redirectBaseUrl = require('./redirect-base-url')
const redirectDefaultQuery = require('./redirect-default-query')
const redirectView = require('./redirect-view')
const saveUrl = require('./save-url')
const setBodySingleRequests = require('./set-body.single-requests')
const setDashboardMoveSummary = require('./set-dashboard-move-summary')
const setFilterSingleRequests = require('./set-filter.single-requests')
const setFromLocation = require('./set-from-location')
const setPagination = require('./set-pagination')
const setResultsOutgoing = require('./set-results.outgoing')
const setResultsSingleRequests = require('./set-results.single-requests')

module.exports = {
  redirectBaseUrl,
  redirectDefaultQuery,
  redirectView,
  saveUrl,
  setDashboardMoveSummary,
  setBodySingleRequests,
  setFromLocation,
  setFilterSingleRequests,
  setResultsOutgoing,
  setResultsSingleRequests,
  setPagination,
}
