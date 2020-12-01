const { omit, get } = require('lodash')

const { FEATURE_FLAGS } = require('../../config')

function setPrimaryNavigation(req, res, next) {
  const items = [
    {
      permission: 'dashboard:view',
      text: req.t('primary_navigation.home'),
      href: '/',
      active: req.path === '/',
    },
    {
      permission: 'dashboard:view:population',
      text: req.t('primary_navigation.population'),
      href: '/population',
      active: req.path.startsWith('/population'),
      featureFlag: FEATURE_FLAGS.POPULATION_DASHBOARD,
    },
    {
      permission: 'moves:view:outgoing',
      text: req.t('primary_navigation.outgoing'),
      href: '/moves/outgoing',
      active: req.path.startsWith('/moves') && req.path.endsWith('/outgoing'),
    },
    {
      permission: 'moves:view:incoming',
      text: req.t('primary_navigation.incoming'),
      href: '/moves/incoming',
      active: req.path.startsWith('/moves') && req.path.endsWith('/incoming'),
    },
    {
      permission: 'moves:view:proposed',
      text: req.t('primary_navigation.single_requests'),
      href: '/moves/requested',
      active: req.path.startsWith('/moves') && req.path.endsWith('/requested'),
    },
    {
      permission: 'allocations:view',
      text: req.t('primary_navigation.allocations'),
      href: '/allocations',
      active:
        req.path.startsWith('/allocations') && req.path.endsWith('/outgoing'),
    },
  ]

  res.locals.primaryNavigation = items
    .filter(item => req.canAccess(item.permission))
    .filter(item => get(item, 'featureFlag', true))
    .map(item => omit(item, 'permission'))

  next()
}

module.exports = setPrimaryNavigation
