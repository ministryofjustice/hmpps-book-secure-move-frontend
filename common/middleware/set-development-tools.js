const {
  mountpath: toolsMountpath,
  routes: toolsRoutes,
} = require('../../app/tools')

function setDevelopmentTools(req, res, next) {
  const items = [
    {
      href: `${toolsMountpath}${toolsRoutes.permissions}`,
      text: 'Set permissions',
    },
  ]

  res.locals.DEVELOPMENT_TOOLS = {
    items,
  }

  next()
}

module.exports = setDevelopmentTools
