const { get } = require('lodash')

const permissions = require('./permissions')

function setPrimaryNavigation(req, res, next) {
  const userPermissions = get(req.session, 'user.permissions')
  const items = []

  if (permissions.check('dashboard:view', userPermissions)) {
    items.push({
      text: req.t('primary_navigation.home'),
      href: '/',
      active: req.path === '/',
    })
  }

  if (permissions.check('moves:view:proposed', userPermissions)) {
    items.push({
      text: req.t('primary_navigation.single_requests'),
      href: '/moves/requested',
      active: req.path.startsWith('/moves') && req.path.endsWith('/requested'),
    })
  }

  if (permissions.check('allocations:view', userPermissions)) {
    items.push({
      text: req.t('primary_navigation.allocations'),
      href: '/allocations',
      active:
        req.path.startsWith('/allocations') && req.path.endsWith('/outgoing'),
    })
  }

  if (permissions.check('moves:view:outgoing', userPermissions)) {
    items.push({
      text: req.t('primary_navigation.outgoing'),
      href: '/moves/outgoing',
      active: req.path.startsWith('/moves') && req.path.endsWith('/outgoing'),
    })
  }

  res.locals.primaryNavigation = items
  next()
}

module.exports = setPrimaryNavigation
