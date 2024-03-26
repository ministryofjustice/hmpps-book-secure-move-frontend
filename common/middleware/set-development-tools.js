const {
  mountpath: toolsMountpath,
  routes: toolsRoutes,
} = require('../../app/tools')

function setDevelopmentTools(req, res, next) {
  const items = [
    {
      href: `${toolsMountpath}${toolsRoutes.permissions}?r=${req.url}`,
      dataModule: 'app-set-permissions',
      id: 'set-permissions',
      text: 'Set permissions',
    },
    {
      href: '#',
      dataModule: 'app-toggle-banner',
      id: 'toggle-banner',
      text: 'Toggle banner',
    },
  ]

  res.locals.DEVELOPMENT_TOOLS = {
    items,
  }

  next()
}

module.exports = setDevelopmentTools
