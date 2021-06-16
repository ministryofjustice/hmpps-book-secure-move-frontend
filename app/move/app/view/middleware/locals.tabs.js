async function setTabs(req, res, next) {
  const tabs = [
    {
      text: 'Warnings',
      url: `${req.baseUrl}/warnings`,
    },
    {
      text: 'Assessments',
      url: `${req.baseUrl}/assessments`,
    },
    {
      text: 'History of events',
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
