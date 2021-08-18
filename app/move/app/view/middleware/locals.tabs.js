function setTabs(req, res, next) {
  const tabs = [
    {
      text: 'moves::tabs.warnings',
      url: `${req.baseUrl}/warnings`,
    },
    {
      text: 'moves::tabs.details',
      url: `${req.baseUrl}/details`,
    },
    {
      text: 'moves::tabs.timeline',
      url: `${req.baseUrl}/timeline`,
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
