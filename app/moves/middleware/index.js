const allowGroupByVehicle = require('./allow-group-by-vehicle')
const redirectBaseUrl = require('./redirect-base-url')
const saveUrl = require('./save-url')
const setBodyRequestFilters = require('./set-body-request-filters')
const setBodyMoves = require('./set-body.moves')
const setBodySingleRequests = require('./set-body.single-requests')
const setDownloadResultsMoves = require('./set-download-results.moves')
const setDownloadResultsSingleRequests = require('./set-download-results.single-requests')
const setFilterMoves = require('./set-filter.moves')
const setFilterSingleRequests = require('./set-filter.single-requests')
const setFromLocation = require('./set-from-location')
const setResultsMoves = require('./set-results.moves')
const setResultsSingleRequests = require('./set-results.single-requests')

module.exports = {
  redirectBaseUrl,
  saveUrl,
  setBodyMoves,
  setBodyRequestFilters,
  setBodySingleRequests,
  setDownloadResultsMoves,
  setDownloadResultsSingleRequests,
  setFromLocation,
  setFilterMoves,
  setFilterSingleRequests,
  setResultsMoves,
  setResultsSingleRequests,
  allowGroupByVehicle,
}
