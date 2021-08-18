function setTabs(req, res, next) {
  const urls = res.locals.urls
  const tabs = [
    {
      text: 'moves::tabs.warnings',
      url: urls.move.warnings,
    },
    {
      text: 'moves::tabs.details',
      url: urls.move.details,
    },
    {
      text: 'moves::tabs.timeline',
      url: urls.move.timeline,
    },
  ]

  res.locals.tabs = tabs.map(item => {
    return {
      ...item,
      isActive: req.originalUrl.endsWith(item.url),
    }
  })

  next()
}

module.exports = setTabs
