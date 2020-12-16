const getMoveUrl = require('./get-move-url')

const getTabsUrls = move => {
  const moveId = move.id
  const tabsUrls = {
    view: getMoveUrl(moveId),
    timeline: getMoveUrl(moveId, 'timeline'),
  }
  return tabsUrls
}

module.exports = getTabsUrls
