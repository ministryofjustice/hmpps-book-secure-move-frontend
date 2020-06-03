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
    allocations: {
      filter: req.filterAllocations,
      heading: 'dashboard::sections.allocations.heading',
      permission: 'allocations:view',
    },
    singleRequests: {
      filter: req.filterSingleRequests,
      heading: 'dashboard::sections.single_requests.heading',
      permission: 'moves:view:proposed',
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
