const { get } = require('lodash')

const permissions = require('./permissions')

function setPrimaryNavigation(req, res, next) {
  const userPermissions = get(req.session, 'user.permissions')
  const items = []

  if (permissions.check('dashboard:view', userPermissions)) {
    items.push({
      active: req.path === '/',
      href: '/',
      text: req.t('primary_navigation.home'),
    })
  }

  if (permissions.check('moves:view:proposed', userPermissions)) {
    items.push({
      active: req.path.startsWith('/moves') && req.path.endsWith('/requested'),
      href: '/moves/requested',
      text: req.t('primary_navigation.single_requests'),
    })
  }

  if (permissions.check('allocations:view', userPermissions)) {
    items.push({
      active:
        req.path.startsWith('/allocations') && req.path.endsWith('/outgoing'),
      href: '/allocations',
      text: req.t('primary_navigation.allocations'),
    })
  }

  if (permissions.check('moves:view:outgoing', userPermissions)) {
    items.push({
      active: req.path.startsWith('/moves') && req.path.endsWith('/outgoing'),
      href: '/moves/outgoing',
      text: req.t('primary_navigation.outgoing'),
    })
  }

  res.locals.primaryNavigation = items
  next()
}

module.exports = setPrimaryNavigation
