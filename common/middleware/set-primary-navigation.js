const { format } = require('date-fns')
const { get } = require('lodash')

const permissions = require('./permissions')

const baseRegex =
  '^\\/moves\\/(day|week)(\\/\\d{4}-\\d{2}-\\d{2})(\\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})?'
const homeRegex = new RegExp(`${baseRegex}$`)
const proposedRegex = new RegExp(`${baseRegex}\\/proposed$`)
const outgoingRegex = new RegExp(`${baseRegex}\\/outgoing$`)

function setPrimaryNavigation(req, res, next) {
  const { TODAY, REQUEST_PATH } = res.locals
  const date = format(TODAY, 'yyyy-MM-dd')
  const userPermissions = get(req.session, 'user.permissions')
  const locationId = get(res.locals, 'CURRENT_LOCATION.id')
  const locationInUrl = locationId ? `/${locationId}` : ''
  const items = []

  if (permissions.check('moves:view:dashboard', userPermissions)) {
    items.push({
      text: req.t('primary_navigation.home'),
      href: '/moves',
      active: homeRegex.test(REQUEST_PATH),
    })
  }

  if (permissions.check('moves:view:proposed', userPermissions)) {
    items.push({
      text: req.t('primary_navigation.single_requests'),
      href: `/moves/week/${date}${locationInUrl}/proposed`,
      active: proposedRegex.test(REQUEST_PATH),
    })
  }

  if (permissions.check('moves:view:outgoing', userPermissions)) {
    items.push({
      text: req.t('primary_navigation.outgoing'),
      href: `/moves/day/${date}${locationInUrl}/outgoing`,
      active: outgoingRegex.test(REQUEST_PATH),
    })
  }

  res.locals.primaryNavigation = items
  next()
}

module.exports = setPrimaryNavigation
