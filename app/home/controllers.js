const { get } = require('lodash')

const dateHelpers = require('../../common/helpers/date')
const permissions = require('../../common/middleware/permissions')

function movesRedirect(req, res, next) {
  // TODO: Remove this once we enable the dashboard for all users
  // Moves will then likely always redirect to the dashboard
  const userPermissions = get(req.session, 'user.permissions')

  if (!permissions.check('dashboard:view', userPermissions)) {
    return res.redirect('/moves')
  }

  next()
}

function dashboard(req, res) {
  const currentWeek = dateHelpers.getCurrentWeekAsRange()
  const today = new Date().toISOString()

  const sections = {
    outgoing: {
      permission: 'moves:view:outgoing',
      heading: 'dashboard::sections.outgoing.heading',
      filter: req.filterOutgoing,
      period: 'day',
    },
    incoming: {
      permission: 'moves:view:incoming',
      heading: 'dashboard::sections.incoming.heading',
      filter: req.filterIncoming,
      period: 'day',
    },
    singleRequests: {
      permission: 'moves:view:proposed',
      heading: 'dashboard::sections.single_requests.heading',
      filter: req.filterSingleRequests,
      period: 'week',
    },
    allocations: {
      permission: 'allocations:view',
      heading: 'dashboard::sections.allocations.heading',
      filter: req.filterAllocations,
      period: 'week',
    },
  }

  res.render('home/dashboard', {
    pageTitle: 'dashboard::page_title',
    sections,
    currentWeek,
    today,
  })
}

module.exports = {
  movesRedirect,
  dashboard,
}
