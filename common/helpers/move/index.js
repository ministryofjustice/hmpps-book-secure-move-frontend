const canCancelMove = require('./can-cancel-move')
const canEditMove = require('./can-edit-move')
const getLocals = require('./get-locals')
const getMoveWithSummary = require('./get-move-with-summary')
const getTabsUrls = require('./get-tabs-urls')
const getUpdateUrls = require('./get-update-urls')
const mapUpdateLink = require('./map-update-link')

module.exports = {
  canCancelMove,
  canEditMove,
  getLocals,
  getMoveWithSummary,
  getTabsUrls,
  getUpdateUrls,
  mapUpdateLink,
}
