const redirectBaseUrl = require('./redirect-base-url')
const saveUrl = require('./save-url')
const setDashboardMoveSummary = require('./set-dashboard-move-summary')
const setFromLocation = require('./set-from-location')
const setMoveTypeNavigation = require('./set-move-type-navigation')
const setMovesByDateAllLocations = require('./set-moves-by-date-all-locations')
const setMovesByDateAndLocation = require('./set-moves-by-date-and-location')
const setMovesByDateRangeAndStatus = require('./set-moves-by-date-range-and-status')
const setPagination = require('./set-pagination')

module.exports = {
  redirectBaseUrl,
  saveUrl,
  setDashboardMoveSummary,
  setFromLocation,
  setMoveTypeNavigation,
  setMovesByDateAllLocations,
  setMovesByDateAndLocation,
  setMovesByDateRangeAndStatus,
  setPagination,
}
