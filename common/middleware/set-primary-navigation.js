const { get } = require('lodash')

const permissions = require('./permissions')

const baseRegex =
  '^\\/moves\\/(day|week)(\\/\\d{4}-\\d{2}-\\d{2})(\\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})?'
const homeRegex = new RegExp(`${baseRegex}$`)

function setPrimaryNavigation(req, res, next) {
  const userPermissions = get(req.session, 'user.permissions')
  const items = []

  if (permissions.check('moves:view:dashboard', userPermissions)) {
    items.push({
      text: req.t('primary_navigation.home'),
      href: '/moves',
      active: homeRegex.test(req.path),
    })
  }

  if (permissions.check('moves:view:proposed', userPermissions)) {
    items.push({
      text: req.t('primary_navigation.single_requests'),
      href: '/moves/requested',
      active: req.path.endsWith('/requested'),
    })
  }

  if (permissions.check('moves:view:outgoing', userPermissions)) {
    items.push({
      text: req.t('primary_navigation.outgoing'),
      href: '/moves/outgoing',
      active: req.path.endsWith('/outgoing'),
    })
  }

  res.locals.primaryNavigation = items
  next()
}

module.exports = setPrimaryNavigation
