const redirectBaseUrl = require('./redirect-base-url')
const saveUrl = require('./save-url')
const setDashboardMoveSummary = require('./set-dashboard-move-summary')
const setFilterSingleRequests = require('./set-filter.single-requests')
const setFromLocation = require('./set-from-location')
const setMovesByDateAllLocations = require('./set-moves-by-date-all-locations')
const setMovesByDateAndLocation = require('./set-moves-by-date-and-location')
const setMovesByDateRangeAndStatus = require('./set-moves-by-date-range-and-status')
const setPagination = require('./set-pagination')

module.exports = {
  redirectBaseUrl,
  saveUrl,
  setDashboardMoveSummary,
  setFromLocation,
  setMovesByDateAllLocations,
  setMovesByDateAndLocation,
  setMovesByDateRangeAndStatus,
  setFilterSingleRequests,
  setPagination,
}
