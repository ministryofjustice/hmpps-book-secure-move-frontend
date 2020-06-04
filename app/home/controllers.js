const { get } = require('lodash')

const permissions = require('../../common/middleware/permissions')

function dashboard(req, res) {
  const userPermissions = get(req.session, 'user.permissions')

  if (!permissions.check('dashboard:view', userPermissions)) {
    // TODO: Remove this once we enable the dashboard for all users
    // Moves will then likely always redirect to the dashboard
    return res.redirect('/moves')
  }

  const sections = {
    outgoing: {
      permission: 'moves:view:outgoing',
      heading: 'dashboard::sections.outgoing.heading',
      filter: req.filterOutgoing,
    },
    incoming: {
      permission: 'moves:view:incoming',
      heading: 'dashboard::sections.incoming.heading',
      filter: req.filterIncoming,
    },
    singleRequests: {
      permission: 'moves:view:proposed',
      heading: 'dashboard::sections.single_requests.heading',
      filter: req.filterSingleRequests,
    },
    allocations: {
      permission: 'allocations:view',
      heading: 'dashboard::sections.allocations.heading',
      filter: req.filterAllocations,
    },
  }

  res.render('home/dashboard', {
    pageTitle: 'dashboard::page_title',
    sections,
  })
}

module.exports = {
  dashboard,
}
