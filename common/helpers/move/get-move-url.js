const getMoveUrls = require('./get-move-urls')

module.exports = (moveId, view = 'view', options) =>
  getMoveUrls(moveId, options)[view]
