const getTabsUrls = move => {
  const tabsUrls = {
    view: `/move/${move.id}`,
    timeline: `/move/${move.id}/timeline`,
  }
  return tabsUrls
}

module.exports = getTabsUrls
