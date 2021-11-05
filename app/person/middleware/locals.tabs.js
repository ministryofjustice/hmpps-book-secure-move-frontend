const { get } = require('lodash')

const { check } = require('../../../common/middleware/permissions')

module.exports = (req, res, next) => {
  const tabs = [
    {
      text: 'person::tabs.personal_details',
      url: `${req.baseUrl}/personal-details`,
    },
  ]

  const userPermissions = get(req.session, 'user.permissions')

  if (check('locations:contract_delivery_manager', userPermissions)) {
    tabs.push({
      text: 'person::tabs.moves',
      url: `${req.baseUrl}/moves`,
    })
  }

  res.locals.tabs = tabs.map(item => ({
    ...item,
    isActive: req.originalUrl.split('?').shift().endsWith(item.url),
  }))

  if (req.query?.move) {
    res.locals.tabs.forEach(tab => {
      tab.url += `?move=${req.query.move}`
    })
  }

  next()
}
