module.exports = (req, res, next) => {
  const tabs = [
    {
      text: 'person::tabs.personal_details',
      url: `${req.baseUrl}/personal-details`,
    },
    {
      text: 'person::tabs.moves',
      url: `${req.baseUrl}/moves`,
    },
  ]

  res.locals.tabs = tabs.map(item => ({
    ...item,
    isActive: req.originalUrl.split('?').shift().endsWith(item.url),
  }))

  next()
}
